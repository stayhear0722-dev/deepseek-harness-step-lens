"""Fixed English-to-Chinese inference. Only in-memory JSON lines cross the pipe."""

import json
from pathlib import Path
import re
import sys


runtime = Path(__file__).resolve().parents[1] / "translation-runtime"
sys.path.insert(0, str(runtime / "python"))

# A system C++ runtime can predate the Windows inference wheels. This
# app-local copy is loaded only into the isolated worker process.
if sys.platform == "win32" and (runtime / "msvcp140.dll").is_file():
    from ctypes import WinDLL

    msvc_runtime = WinDLL(str(runtime / "msvcp140.dll"))

import ctranslate2
import sentencepiece


def main():
    model = runtime / "en-zh"
    tokenizer = sentencepiece.SentencePieceProcessor(
        model_proto=(model / "sentencepiece.model").read_bytes()
    )
    translator = ctranslate2.Translator(
        str(model / "model"), device="cpu", inter_threads=1, intra_threads=2, compute_type="int8"
    )
    for line in sys.stdin.buffer:
        request = json.loads(line)
        response = {"id": request["id"]}
        try:
            encoded = tokenizer.encode(request["texts"], out_type=str)
            outputs = translator.translate_batch(
                encoded, beam_size=2, max_input_length=240, max_decoding_length=200,
                replace_unknowns=True,
            )
            response["translations"] = []
            for output in outputs:
                text = tokenizer.decode(output.hypotheses[0]).replace("▁", " ")
                response["translations"].append(re.sub(r"\s+([，。！？；：])", r"\1", text).strip())
        except Exception:
            # The caller reports a generic failure. Never log the input or model output.
            pass
        print(json.dumps(response), flush=True)


if __name__ == "__main__":
    main()
