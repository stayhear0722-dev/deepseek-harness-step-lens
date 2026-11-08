"""Install the optional English-to-Chinese translator beside the plugin."""

import argparse
import hashlib
import json
from pathlib import Path
import platform
import shutil
import subprocess
import sys
import sysconfig
import tempfile
from urllib.request import urlopen
import zipfile


MODEL_NAME = "translate-en_zh-1_9.argosmodel"
MODEL_URL = f"https://argos-net.com/v1/{MODEL_NAME}"
MODEL_SIZE = 70_743_021
MODEL_SHA256 = "433e7c4f034d87fbe2353161e05f18646d7999452f801a4e1f0378522b9850ab"
MODEL_FILES = (
    "README.md",
    "metadata.json",
    "sentencepiece.model",
    "model/config.json",
    "model/model.bin",
    "model/shared_vocabulary.json",
)


def verified_model(temporary, local_model):
    if local_model is None:
        local_model = temporary / MODEL_NAME
        print(f"Downloading the Argos English-to-Chinese model ({MODEL_SIZE / 1_000_000:.1f} MB)...", flush=True)
        with urlopen(MODEL_URL, timeout=60) as response, local_model.open("wb") as output:
            size = 0
            while chunk := response.read(1024 * 1024):
                size += len(chunk)
                if size > MODEL_SIZE:
                    raise ValueError("The model download exceeded its expected size.")
                output.write(chunk)
    with local_model.open("rb") as model:
        digest = hashlib.file_digest(model, "sha256").hexdigest()
    if local_model.stat().st_size != MODEL_SIZE or digest != MODEL_SHA256:
        raise ValueError("The model does not match the expected size and SHA-256.")
    return local_model


def extract_model(archive, target):
    with zipfile.ZipFile(archive) as model:
        for name in MODEL_FILES:
            destination = target / name
            destination.parent.mkdir(parents=True, exist_ok=True)
            with model.open(f"translate-en_zh-1_9/{name}") as source, destination.open("wb") as output:
                shutil.copyfileobj(source, output)


def check_worker(root, temporary):
    # The worker resolves its runtime relative to itself. Exercise the staged
    # installation before making it visible to the plugin.
    worker = temporary / "src" / "offline-translation.py"
    worker.parent.mkdir()
    shutil.copyfile(root / "src" / worker.name, worker)
    request = json.dumps({"id": 1, "texts": ["Read the report before editing it."]}) + "\n"
    completed = subprocess.run(
        [sys.executable, "-I", "-B", "-u", str(worker)],
        input=request,
        encoding="utf-8",
        capture_output=True,
        timeout=45,
    )
    if completed.returncode:
        raise RuntimeError(
            "The local translator could not start. Install or update the Microsoft Visual C++ "
            "v14 Redistributable for x64 and retry."
        )
    result = json.loads(completed.stdout)
    translations = result.get("translations", [])
    if result.get("id") != 1 or len(translations) != 1 or not any(
        "\u4e00" <= character <= "\u9fff" for character in translations[0]
    ):
        raise RuntimeError("The local translator did not return the expected Chinese test output.")


def install(args):
    if (
        sys.platform != "win32"
        or platform.machine().lower() not in {"amd64", "x86_64"}
        or sys.maxsize <= 2**32
        or sys.implementation.name != "cpython"
        or sys.version_info[:2] != (3, 13)
        or sysconfig.get_config_var("Py_GIL_DISABLED")
    ):
        raise ValueError("This setup requires regular 64-bit CPython 3.13 on Windows x64.")

    root = Path(__file__).resolve().parents[1]
    runtime = root / "translation-runtime"
    if runtime.exists():
        raise ValueError("translation-runtime already exists. Move it aside before reinstalling.")

    with tempfile.TemporaryDirectory(prefix=".translation-runtime-", dir=root) as directory:
        temporary = Path(directory)
        staged = temporary / runtime.name
        archive = verified_model(temporary, args.model_file)
        extract_model(archive, staged / "en-zh")
        print("Installing verified Python wheels into the plugin directory...", flush=True)
        wheel_source = ["--no-index", "--find-links", str(args.wheel_dir.resolve())] if args.wheel_dir else [
            "--index-url", "https://pypi.org/simple",
        ]
        subprocess.run(
            [
                sys.executable, "-m", "pip", "--isolated", "install",
                "--disable-pip-version-check", "--no-input", "--only-binary=:all:",
                "--require-hashes", *wheel_source, "--target", str(staged / "python"),
                "-r", str(root / "scripts" / "requirements-translation.txt"),
            ],
            check=True,
        )
        print("Checking local inference...", flush=True)
        check_worker(root, temporary)
        (staged / "python-path.txt").write_text(sys.executable + "\n", encoding="utf-8")
        staged.rename(runtime)

    print("Offline translation is ready. Refresh the Harness view to use it.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model-file", type=Path, help=f"use a previously downloaded {MODEL_NAME}")
    parser.add_argument("--wheel-dir", type=Path, help="install the pinned wheels from a local directory")
    try:
        install(parser.parse_args())
    except (OSError, ValueError, RuntimeError, subprocess.SubprocessError) as error:
        parser.exit(1, f"Translation setup failed. {error}\n")
