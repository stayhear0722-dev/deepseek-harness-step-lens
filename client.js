window.__ModuleLoader__.load({
  id: '@local/step-lens',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const GUIDE = {
  "categories": {
    "read": {
      "zh": "读取",
      "en": "Read"
    },
    "search": {
      "zh": "搜索",
      "en": "Search"
    },
    "write": {
      "zh": "修改",
      "en": "Edit"
    },
    "run": {
      "zh": "执行",
      "en": "Run"
    },
    "web": {
      "zh": "联网",
      "en": "Web"
    },
    "collab": {
      "zh": "协作",
      "en": "Collaborate"
    },
    "deliver": {
      "zh": "交付",
      "en": "Deliver"
    },
    "other": {
      "zh": "其他",
      "en": "Other"
    }
  },
  "tools": {
    "read": {
      "category": "read",
      "title": {
        "zh": "读取文件",
        "en": "Read a file"
      },
      "what": {
        "zh": "按行打开一个文本文件，把里面的内容读进来。",
        "en": "Opens a text file and reads its lines into the conversation."
      },
      "why": {
        "zh": "先看到真实内容再判断，避免凭印象猜测。",
        "en": "Looks at the real content before deciding instead of guessing."
      }
    },
    "glob": {
      "category": "search",
      "title": {
        "zh": "按名称找文件",
        "en": "Find files by name"
      },
      "what": {
        "zh": "用文件名或通配符在目录里查找文件路径。",
        "en": "Searches folders for file paths that match a name pattern."
      },
      "why": {
        "zh": "先摸清有哪些文件，再决定从哪里下手。",
        "en": "Maps out what files exist before deciding where to start."
      }
    },
    "grep": {
      "category": "search",
      "title": {
        "zh": "搜索文件内容",
        "en": "Search file contents"
      },
      "what": {
        "zh": "按关键词或规则搜索很多文件里的文字。",
        "en": "Searches the text inside many files for a keyword or pattern."
      },
      "why": {
        "zh": "直接定位相关代码，省去逐个打开文件。",
        "en": "Jumps straight to relevant code instead of opening every file."
      }
    },
    "write": {
      "category": "write",
      "title": {
        "zh": "写入文件",
        "en": "Write a file"
      },
      "what": {
        "zh": "新建一个文件，或用新内容整体替换旧文件。",
        "en": "Creates a file, or replaces a whole file with new content."
      },
      "why": {
        "zh": "把想好的结果真正保存到磁盘上，做出改动。",
        "en": "Turns a decision into a real change saved on disk."
      }
    },
    "edit": {
      "category": "write",
      "title": {
        "zh": "修改文件",
        "en": "Edit a file"
      },
      "what": {
        "zh": "把文件里的一小段文字替换成新的文字。",
        "en": "Replaces one exact piece of text inside a file."
      },
      "why": {
        "zh": "只改需要改的地方，不碰其他内容，更安全。",
        "en": "Changes only what is needed and leaves the rest untouched."
      }
    },
    "read_image": {
      "category": "read",
      "title": {
        "zh": "查看图片",
        "en": "View an image"
      },
      "what": {
        "zh": "打开一张图片，看到它上面画了什么。",
        "en": "Opens an image file and shows its visual content."
      },
      "why": {
        "zh": "有些信息用眼睛看，比读文字描述更准确。",
        "en": "Some information is clearer seen than described in words."
      }
    },
    "pwsh": {
      "category": "run",
      "title": {
        "zh": "运行命令行",
        "en": "Run a shell command"
      },
      "what": {
        "zh": "在电脑上执行一条 PowerShell 命令。",
        "en": "Runs a PowerShell command on the computer."
      },
      "why": {
        "zh": "借用现成工具完成检查、构建等实际动作。",
        "en": "Uses existing tools to inspect, build, or test things for real."
      }
    },
    "bash": {
      "category": "run",
      "title": {
        "zh": "运行终端命令",
        "en": "Run a bash command"
      },
      "what": {
        "zh": "在系统终端里执行一条 bash 命令。",
        "en": "Runs a bash command in the system terminal."
      },
      "why": {
        "zh": "真正动手执行任务，而不是停留在讨论上。",
        "en": "Actually does the job with system tools instead of just talking."
      }
    },
    "working_directory": {
      "category": "run",
      "title": {
        "zh": "切换工作目录",
        "en": "Change working folder"
      },
      "what": {
        "zh": "查看或切换当前所在的文件夹位置。",
        "en": "Shows or changes the folder that commands run in."
      },
      "why": {
        "zh": "站对位置，后面的文件操作才不会找错地方。",
        "en": "Standing in the right place keeps later file operations on target."
      }
    },
    "load_workspace_dependencies": {
      "category": "run",
      "title": {
        "zh": "查看可用工具库",
        "en": "Check bundled libraries"
      },
      "what": {
        "zh": "获取本机自带 Python、Node 和库的安装位置。",
        "en": "Gets the paths of bundled Python, Node, and library folders."
      },
      "why": {
        "zh": "用对现成环境，不必自己重装或猜版本。",
        "en": "Uses the provided environment instead of reinstalling or guessing."
      }
    },
    "job_list": {
      "category": "run",
      "title": {
        "zh": "查看后台任务",
        "en": "List background jobs"
      },
      "what": {
        "zh": "列出正在后台运行的命令和任务。",
        "en": "Lists commands and jobs that are running in the background."
      },
      "why": {
        "zh": "同时推进多件事时，随时掌握每件做到哪了。",
        "en": "Keeps track of several parallel tasks at the same time."
      }
    },
    "job_output": {
      "category": "run",
      "title": {
        "zh": "读取任务结果",
        "en": "Read job output"
      },
      "what": {
        "zh": "查看某个后台任务目前的输出或结果。",
        "en": "Shows the current output or final result of a background job."
      },
      "why": {
        "zh": "确认长任务真的成功了，再继续下一步。",
        "en": "Confirms a long job really succeeded before moving on."
      }
    },
    "job_kill": {
      "category": "run",
      "title": {
        "zh": "停止后台任务",
        "en": "Stop a background job"
      },
      "what": {
        "zh": "请求取消一个还在运行的后台任务。",
        "en": "Requests cancellation of a background job that is still running."
      },
      "why": {
        "zh": "方向不对就及时收手，避免浪费时间和资源。",
        "en": "Stops early when a path is wrong, saving time and resources."
      }
    },
    "web_search": {
      "category": "web",
      "title": {
        "zh": "联网搜索",
        "en": "Search the web"
      },
      "what": {
        "zh": "在网上搜索，返回若干网页和简短摘要。",
        "en": "Searches the internet and returns matching pages with summaries."
      },
      "why": {
        "zh": "补上不知道或已经过时的最新信息。",
        "en": "Fills gaps where knowledge is missing or out of date."
      }
    },
    "web_fetch": {
      "category": "web",
      "title": {
        "zh": "打开网页",
        "en": "Fetch a web page"
      },
      "what": {
        "zh": "下载一个网页，把正文内容取回来。",
        "en": "Downloads one web page and returns its readable content."
      },
      "why": {
        "zh": "深入读原始材料，而不是只看搜索摘要。",
        "en": "Reads the original source instead of trusting a short summary."
      }
    },
    "skill": {
      "category": "other",
      "title": {
        "zh": "加载技能说明",
        "en": "Load a skill"
      },
      "what": {
        "zh": "载入一套预先写好的专门操作指南。",
        "en": "Loads a prepared set of detailed instructions for a task."
      },
      "why": {
        "zh": "照着成熟流程做，复杂任务会更稳更规范。",
        "en": "Follows a proven procedure so complex work stays reliable."
      }
    },
    "todo_write": {
      "category": "other",
      "title": {
        "zh": "列出任务清单",
        "en": "Write a task list"
      },
      "what": {
        "zh": "把要做的事整理成一份可勾选的清单。",
        "en": "Records the planned steps as a checklist and updates it."
      },
      "why": {
        "zh": "把大事拆成小步，边做边看得见进度。",
        "en": "Breaks big work into visible steps and tracks progress."
      }
    },
    "present": {
      "category": "deliver",
      "title": {
        "zh": "交付成果",
        "en": "Deliver results"
      },
      "what": {
        "zh": "把完成好的文件标记为交付物给用户。",
        "en": "Marks finished files as final deliverables for the user."
      },
      "why": {
        "zh": "让用户一眼看到最终成果，而不用翻找文件。",
        "en": "Puts the finished result in front of the user instead of buried files."
      }
    },
    "ask_user_question": {
      "category": "other",
      "title": {
        "zh": "向用户确认",
        "en": "Ask the user"
      },
      "what": {
        "zh": "暂停一下，向用户提出选择题或确认问题。",
        "en": "Pauses to ask the user a question or offer choices."
      },
      "why": {
        "zh": "方向不清时先问清楚，比猜错后返工更省事。",
        "en": "Clarifying when unsure beats guessing and redoing work."
      }
    },
    "subagent": {
      "category": "collab",
      "title": {
        "zh": "派一个助手",
        "en": "Delegate to a helper"
      },
      "what": {
        "zh": "把一件独立的事交给另一个 AI 助手去做。",
        "en": "Hands one self-contained task to a separate AI helper."
      },
      "why": {
        "zh": "分头干活，主线程保持专注、不被打乱。",
        "en": "Working in parallel keeps the main thread focused and clean."
      }
    },
    "subagent_fork": {
      "category": "collab",
      "title": {
        "zh": "派生助手继续",
        "en": "Fork a helper"
      },
      "what": {
        "zh": "开一个继承当前对话内容的新助手。",
        "en": "Starts a helper that inherits everything discussed so far."
      },
      "why": {
        "zh": "后续分析接着现有背景做，不用重复解释。",
        "en": "Continues analysis with existing context instead of re-explaining."
      }
    },
    "workflow": {
      "category": "collab",
      "title": {
        "zh": "编排多助手",
        "en": "Run a workflow"
      },
      "what": {
        "zh": "用脚本安排多个助手分批并行完成任务。",
        "en": "A script runs many helpers in parallel stages to finish a big job."
      },
      "why": {
        "zh": "大范围重复工作交给机器统一调度，更快更全。",
        "en": "Fans out repetitive work at scale for speed and coverage."
      }
    },
    "spawn_teammate": {
      "category": "collab",
      "title": {
        "zh": "组建队友",
        "en": "Spawn a teammate"
      },
      "what": {
        "zh": "创建一个可长期协作的队友助手并给它起名。",
        "en": "Creates a named teammate agent that can keep working with you."
      },
      "why": {
        "zh": "让不同角色各管一摊，长期配合完成大项目。",
        "en": "Gives different roles their own lane for larger projects."
      }
    },
    "send_message": {
      "category": "collab",
      "title": {
        "zh": "给队友发消息",
        "en": "Message a teammate"
      },
      "what": {
        "zh": "向另一个助手发送一条消息或补充要求。",
        "en": "Sends a message or extra instruction to another agent."
      },
      "why": {
        "zh": "中途调整方向或补充信息，不必推翻重来。",
        "en": "Steers work mid-flight without starting over."
      }
    },
    "wait_agent": {
      "category": "collab",
      "title": {
        "zh": "等待队友",
        "en": "Wait for a teammate"
      },
      "what": {
        "zh": "停下来等待某个助手完成当前工作。",
        "en": "Waits until a given agent finishes its current work."
      },
      "why": {
        "zh": "只在确实需要结果时才等，避免空转和误判。",
        "en": "Waits only when the result is truly needed."
      }
    },
    "interrupt_agent": {
      "category": "collab",
      "title": {
        "zh": "叫停助手",
        "en": "Interrupt an agent"
      },
      "what": {
        "zh": "要求某个正在工作的助手立即停下。",
        "en": "Asks a working agent to stop what it is doing."
      },
      "why": {
        "zh": "发现走错方向就马上止损，省下时间。",
        "en": "Cuts losses the moment a direction turns out wrong."
      }
    },
    "list_agents": {
      "category": "collab",
      "title": {
        "zh": "查看助手列表",
        "en": "List agents"
      },
      "what": {
        "zh": "列出所有助手以及它们当前的状态。",
        "en": "Lists all helper agents and what each one is doing."
      },
      "why": {
        "zh": "先看清谁在忙什么，再决定下一步找谁。",
        "en": "Sees who is doing what before deciding whom to involve."
      }
    },
    "list_subagent_models": {
      "category": "collab",
      "title": {
        "zh": "查看可选模型",
        "en": "List helper models"
      },
      "what": {
        "zh": "列出可给助手选用的模型与思考强度。",
        "en": "Lists which models and reasoning levels helpers can use."
      },
      "why": {
        "zh": "按任务难度挑合适的脑力，兼顾效果和成本。",
        "en": "Matches model power to task difficulty for better value."
      }
    },
    "team_task_create": {
      "category": "collab",
      "title": {
        "zh": "新建团队任务",
        "en": "Create a team task"
      },
      "what": {
        "zh": "在共享任务板上新建一条任务。",
        "en": "Adds a new task to the shared team task board."
      },
      "why": {
        "zh": "把分工写下来，大家才不会重复或遗漏。",
        "en": "Writes down the split so nothing is duplicated or missed."
      }
    },
    "team_task_get": {
      "category": "collab",
      "title": {
        "zh": "查看团队任务",
        "en": "Read a team task"
      },
      "what": {
        "zh": "读取任务板上某条任务的详细内容。",
        "en": "Reads the full details of one task on the shared board."
      },
      "why": {
        "zh": "动手前确认任务的范围和当前状态。",
        "en": "Confirms scope and status before starting the work."
      }
    },
    "team_task_list": {
      "category": "collab",
      "title": {
        "zh": "浏览团队任务",
        "en": "List team tasks"
      },
      "what": {
        "zh": "列出任务板上的所有任务和进展。",
        "en": "Lists every task on the board along with its progress."
      },
      "why": {
        "zh": "从全局看整体分工，决定先做哪一件。",
        "en": "Sees the whole board to decide what to do next."
      }
    },
    "team_task_update": {
      "category": "collab",
      "title": {
        "zh": "更新团队任务",
        "en": "Update a team task"
      },
      "what": {
        "zh": "修改任务的状态、负责人或说明。",
        "en": "Changes a task's status, owner, or description."
      },
      "why": {
        "zh": "让队友随时看到最新进展，减少来回追问。",
        "en": "Keeps teammates current and avoids back-and-forth questions."
      }
    },
    "schedule_create": {
      "category": "other",
      "title": {
        "zh": "设置提醒",
        "en": "Create a reminder"
      },
      "what": {
        "zh": "安排一条到点自动触发的提醒。",
        "en": "Schedules a reminder that fires at a chosen time."
      },
      "why": {
        "zh": "把要等的事交给时间，不用一直守着。",
        "en": "Lets time handle waiting instead of watching the clock."
      }
    },
    "schedule_list": {
      "category": "other",
      "title": {
        "zh": "查看提醒",
        "en": "List reminders"
      },
      "what": {
        "zh": "列出当前已经设置的所有提醒。",
        "en": "Lists all reminders currently set in the session."
      },
      "why": {
        "zh": "确认哪些事已经安排好了、哪些还没做。",
        "en": "Checks what is already scheduled and still pending."
      }
    },
    "schedule_delete": {
      "category": "other",
      "title": {
        "zh": "删除提醒",
        "en": "Delete a reminder"
      },
      "what": {
        "zh": "取消一条已经设置的提醒。",
        "en": "Removes a reminder that is no longer needed."
      },
      "why": {
        "zh": "计划变了就清理掉，避免旧提醒造成干扰。",
        "en": "Cleans up when plans change so old reminders do not mislead."
      }
    },
    "schedule_update": {
      "category": "other",
      "title": {
        "zh": "修改提醒",
        "en": "Update a reminder"
      },
      "what": {
        "zh": "调整已有提醒的时间或提醒内容。",
        "en": "Changes the time or content of an existing reminder."
      },
      "why": {
        "zh": "小改动直接更新，比删掉重建更省事。",
        "en": "Adjusts in place instead of deleting and recreating."
      }
    },
    "session_search": {
      "category": "search",
      "title": {
        "zh": "搜索历史会话",
        "en": "Search past sessions"
      },
      "what": {
        "zh": "在以前的对话记录里搜索相关内容。",
        "en": "Searches earlier session logs for matching content."
      },
      "why": {
        "zh": "找回过去做过的事，避免重复劳动。",
        "en": "Recovers past work so it does not need redoing."
      }
    },
    "session_event_read": {
      "category": "search",
      "title": {
        "zh": "读取会话记录",
        "en": "Read session events"
      },
      "what": {
        "zh": "打开某段历史会话，读取其中的事件。",
        "en": "Opens a past session and reads its recorded events."
      },
      "why": {
        "zh": "复盘当时发生了什么，弄清来龙去脉。",
        "en": "Reconstructs what happened and why it happened."
      }
    },
    "session_event_search": {
      "category": "search",
      "title": {
        "zh": "搜索会话事件",
        "en": "Search session events"
      },
      "what": {
        "zh": "在历史事件里按关键词查找。",
        "en": "Finds recorded events by keyword across sessions."
      },
      "why": {
        "zh": "从大量记录里快速定位关键那一刻。",
        "en": "Pinpoints the key moment inside a large history."
      }
    },
    "session_event_trace": {
      "category": "search",
      "title": {
        "zh": "查看事件脉络",
        "en": "Trace session events"
      },
      "what": {
        "zh": "查看某次操作前后的关联事件链条。",
        "en": "Shows the chain of related events around one action."
      },
      "why": {
        "zh": "顺藤摸瓜，看清一步动作的因果。",
        "en": "Follows the chain to see cause and effect."
      }
    },
    "session_trace": {
      "category": "search",
      "title": {
        "zh": "追踪会话全程",
        "en": "Trace a session"
      },
      "what": {
        "zh": "按顺序回看一次会话的完整过程。",
        "en": "Replays a whole session step by step in order."
      },
      "why": {
        "zh": "整体复盘解决思路，提炼可复用的方法。",
        "en": "Reviews the whole approach and extracts reusable steps."
      }
    },
    "create_goal": {
      "category": "other",
      "title": {
        "zh": "设定长期目标",
        "en": "Create a goal"
      },
      "what": {
        "zh": "登记一个会跨多轮持续推进的目标。",
        "en": "Registers an objective that persists across many rounds."
      },
      "why": {
        "zh": "大任务需要连续性，不能做一半就断掉。",
        "en": "Big work needs continuity so it is not dropped halfway."
      }
    },
    "get_goal": {
      "category": "other",
      "title": {
        "zh": "查看当前目标",
        "en": "Read the current goal"
      },
      "what": {
        "zh": "读取当前目标的内容和进度信息。",
        "en": "Reads the current goal and its progress details."
      },
      "why": {
        "zh": "随时对表，确认没有跑偏或漏做。",
        "en": "Checks alignment so the work does not drift."
      }
    },
    "update_goal": {
      "category": "other",
      "title": {
        "zh": "更新目标状态",
        "en": "Update a goal"
      },
      "what": {
        "zh": "修改目标内容，或标记完成、暂停。",
        "en": "Edits a goal or marks it done, paused, or blocked."
      },
      "why": {
        "zh": "让目标始终反映真实情况，方便下次继续。",
        "en": "Keeps the goal truthful so work can resume properly."
      }
    },
    "cordis_inspect_list": {
      "category": "other",
      "title": {
        "zh": "列出可查插件",
        "en": "List plugin inspectors"
      },
      "what": {
        "zh": "列出本机可查询的插件信息入口。",
        "en": "Lists the inspectors that can query plugins on this machine."
      },
      "why": {
        "zh": "先看清有哪些接口，才知道能改什么。",
        "en": "Knows what is available before changing anything."
      }
    },
    "cordis_inspect_query": {
      "category": "other",
      "title": {
        "zh": "查询插件细节",
        "en": "Query plugin details"
      },
      "what": {
        "zh": "向某个入口查询插件的具体配置和数据。",
        "en": "Asks one inspector for a plugin's exact settings and data."
      },
      "why": {
        "zh": "基于真实配置动手，而不是凭猜测改。",
        "en": "Acts on real settings instead of guessing."
      }
    },
    "cordis_inspect_self": {
      "category": "other",
      "title": {
        "zh": "查看自身插件",
        "en": "Inspect this plugin"
      },
      "what": {
        "zh": "查看当前插件自己的信息与结构。",
        "en": "Inspects the running plugin's own information and structure."
      },
      "why": {
        "zh": "改自己之前先了解自己，避免改坏。",
        "en": "Understands itself before changing itself."
      }
    },
    "cordis_run": {
      "category": "other",
      "title": {
        "zh": "运行插件代码",
        "en": "Run plugin code"
      },
      "what": {
        "zh": "在运行环境中执行一段插件脚本。",
        "en": "Executes a short plugin script in the live runtime."
      },
      "why": {
        "zh": "马上试一下想法，比空想更快得到反馈。",
        "en": "Tests an idea immediately rather than theorizing."
      }
    },
    "cordis_define": {
      "category": "other",
      "title": {
        "zh": "定义插件",
        "en": "Define a plugin"
      },
      "what": {
        "zh": "注册一个新的插件或其中一部分。",
        "en": "Registers a new plugin or one of its parts."
      },
      "why": {
        "zh": "把想要的功能变成真正可用的东西。",
        "en": "Turns a desired feature into something that actually works."
      }
    },
    "cordis_stop": {
      "category": "other",
      "title": {
        "zh": "暂停插件",
        "en": "Stop a plugin"
      },
      "what": {
        "zh": "让某个正在运行的插件停下来。",
        "en": "Stops a plugin that is currently running."
      },
      "why": {
        "zh": "出问题先停住，避免影响继续扩大。",
        "en": "Halts first when something breaks to contain the damage."
      }
    },
    "cordis_undefine": {
      "category": "other",
      "title": {
        "zh": "移除插件",
        "en": "Remove a plugin"
      },
      "what": {
        "zh": "从运行环境中彻底移除一个插件。",
        "en": "Removes a plugin entirely from the runtime."
      },
      "why": {
        "zh": "不要的东西清理干净，减少隐患。",
        "en": "Cleans out what is not needed to reduce risk."
      }
    },
    "terminal_open": {
      "category": "run",
      "title": {
        "zh": "打开终端",
        "en": "Open a terminal"
      },
      "what": {
        "zh": "开一个可以持续交互的终端会话。",
        "en": "Opens a terminal session you can keep interacting with."
      },
      "why": {
        "zh": "需要反复输入的场景，用交互终端更顺手。",
        "en": "Interactive terminals suit tasks that need repeated input."
      }
    },
    "terminal_read": {
      "category": "run",
      "title": {
        "zh": "读取终端输出",
        "en": "Read terminal output"
      },
      "what": {
        "zh": "查看终端里最新的输出内容。",
        "en": "Shows the latest output inside a terminal session."
      },
      "why": {
        "zh": "看程序反馈，判断下一步该输入什么。",
        "en": "Reads feedback to decide the next input."
      }
    },
    "terminal_list": {
      "category": "run",
      "title": {
        "zh": "查看终端列表",
        "en": "List terminals"
      },
      "what": {
        "zh": "列出当前所有打开的终端会话。",
        "en": "Lists every terminal session currently open."
      },
      "why": {
        "zh": "同时开多个终端时，先确认操作哪一个。",
        "en": "With several terminals open, confirms which one to use."
      }
    },
    "terminal_signal": {
      "category": "run",
      "title": {
        "zh": "给终端发信号",
        "en": "Signal a terminal"
      },
      "what": {
        "zh": "向终端进程发送中断等控制信号。",
        "en": "Sends a control signal such as an interrupt to a terminal."
      },
      "why": {
        "zh": "程序卡住时能及时打断，不必干等。",
        "en": "Breaks out of a stuck program instead of waiting."
      }
    },
    "terminal_close": {
      "category": "run",
      "title": {
        "zh": "关闭终端",
        "en": "Close a terminal"
      },
      "what": {
        "zh": "关闭一个已经开着的终端会话。",
        "en": "Closes an open terminal session."
      },
      "why": {
        "zh": "用完就关，保持环境干净、不占资源。",
        "en": "Closes what is done to keep the environment clean."
      }
    },
    "lsp": {
      "category": "search",
      "title": {
        "zh": "查询代码信息",
        "en": "Look up code info"
      },
      "what": {
        "zh": "查询代码里定义、引用和报错的位置。",
        "en": "Looks up where symbols are defined, used, or reported as errors."
      },
      "why": {
        "zh": "用工具精确定位，比逐行翻文件更快更准。",
        "en": "Locates precisely instead of scrolling through files."
      }
    },
    "ralph": {
      "category": "other",
      "title": {
        "zh": "持续循环执行",
        "en": "Keep looping"
      },
      "what": {
        "zh": "让助手反复执行直到任务完成。",
        "en": "Keeps the agent working in repeated rounds until done."
      },
      "why": {
        "zh": "需要长时间打磨的任务，靠循环一步步逼近目标。",
        "en": "Long polishing work converges step by step through rounds."
      }
    }
  }
};

/**
 * Pure turn-aware model for AI Step Lens.
 *
 * The panel is organized by conversation turn (one user request = one turn):
 * every turn owns its steps, every step owns its reasoning, tool calls and
 * answer output. This module is DOM-free so the whole structure can be tested
 * under Node before it is compiled into the browser bundle.
 */

/** Category glyphs used by the timeline and the turn summaries. */
const CATEGORY_ICON = {
  read: '📖',
  search: '🔍',
  write: '✏️',
  run: '⚡',
  web: '🌐',
  collab: '👥',
  deliver: '📦',
  other: '🔧',
};

/** Category glyph with a safe fallback for tools missing from the guide. */
function categoryIcon(category) {
  return CATEGORY_ICON[category] || '🔧';
}

/** Read one localized string from `{ zh, en }` content, falling back safely. */
function pick(value, lang) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value[lang] || value.zh || value.en || '';
}

/** Flatten LLM content blocks into display text (text blocks only). */
function textOfContent(content) {
  if (!Array.isArray(content)) return '';
  const parts = [];
  for (const block of content) {
    if (!block) continue;
    if (typeof block === 'string') {
      parts.push(block);
      continue;
    }
    if (typeof block.text === 'string') parts.push(block.text);
  }
  return parts.join('\n');
}

/** Parse a tool call's raw argument JSON without ever throwing. */
function parseArgs(raw, fallback) {
  if (typeof raw === 'string' && raw.trim() !== '') {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    } catch (error) {
      // Partial or invalid JSON while a call is still being prepared: keep going.
    }
  }
  return fallback && typeof fallback === 'object' ? fallback : {};
}

/** Clip a string to a maximum length, appending an ellipsis when shortened. */
function clip(text, max) {
  const source = typeof text === 'string' ? text : text == null ? '' : String(text);
  if (max <= 0 || source.length <= max) return source;
  return source.slice(0, max) + '…';
}

/** First non-empty line of a multi-line string, clipped. */
function firstLine(text, max) {
  const source = typeof text === 'string' ? text : '';
  const line = source.split(/\r?\n/).find((candidate) => candidate.trim() !== '') || '';
  return clip(line.trim(), max);
}

/** Last path segment of a Windows or POSIX path. */
function basename(path) {
  if (typeof path !== 'string' || path === '') return '';
  const parts = path.split(/[\\/]/).filter(Boolean);
  return parts.length === 0 ? path : parts[parts.length - 1];
}

/** Render one argument value as a compact subject string. */
function formatValue(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return '';
    if (typeof value[0] === 'string') return value.map((item) => String(item)).join(' / ');
    if (value[0] && typeof value[0] === 'object' && typeof value[0].path === 'string') {
      return value.map((item) => basename(item.path)).join('、');
    }
    return '× ' + value.length;
  }
  if (typeof value === 'object') {
    if (typeof value.path === 'string') return value.path;
    if (typeof value.name === 'string') return value.name;
    return '';
  }
  return '';
}

/** Preferred argument fields per tool, most human-readable first. */
const SUBJECT_FIELDS = {
  read: ['file_path'],
  write: ['file_path'],
  edit: ['file_path'],
  read_image: ['file_path'],
  glob: ['pattern'],
  grep: ['pattern'],
  pwsh: ['description', 'command'],
  bash: ['description', 'command'],
  working_directory: ['cd'],
  web_search: ['queries'],
  web_fetch: ['url'],
  skill: ['name'],
  present: ['files'],
  subagent: ['description'],
  subagent_fork: ['description'],
  workflow: ['name'],
  spawn_teammate: ['name'],
  send_message: ['target', 'message'],
  interrupt_agent: ['target'],
  job_output: ['job_id'],
  job_kill: ['job_id'],
  schedule_create: ['title'],
  schedule_update: ['id'],
  schedule_delete: ['id'],
  session_search: ['query'],
  session_event_read: ['query'],
  session_event_search: ['query'],
  session_event_trace: ['query'],
  session_trace: ['query'],
  create_goal: ['objective'],
  update_goal: ['action'],
  team_task_create: ['subject'],
  team_task_get: ['task_id'],
  team_task_update: ['task_id'],
  cordis_inspect_query: ['provider'],
  cordis_run: ['pluginId'],
  cordis_define: ['id'],
  ask_user_question: ['header'],
  terminal_open: ['name'],
  terminal_read: ['terminal_id'],
  terminal_signal: ['terminal_id'],
  terminal_close: ['terminal_id'],
  lsp: ['operation'],
};

const FALLBACK_FIELDS = [
  'file_path', 'path', 'pattern', 'url', 'query', 'queries', 'description',
  'command', 'name', 'title', 'id', 'objective', 'provider', 'target', 'subject',
];

/** Derive the concrete subject a tool call operates on (file, query, command…). */
function subjectOf(name, args) {
  const object = args && typeof args === 'object' ? args : {};
  const fields = SUBJECT_FIELDS[name] || FALLBACK_FIELDS;
  for (const field of fields) {
    const text = formatValue(object[field]);
    if (text !== '') {
      const normalized = field === 'command' ? firstLine(text, 110) : text;
      return clip(normalized, field === 'description' || field === 'command' ? 110 : 90);
    }
  }
  return '';
}

/** Keep tool requests in place while merging adjacent text fragments. */
function assistantRuns(blocks) {
  const runs = [];
  for (const block of Array.isArray(blocks) ? blocks : []) {
    if (!block || typeof block !== 'object') continue;
    if (block.kind === 'tool-call') {
      runs.push({ kind: 'tool-call', block });
      continue;
    }
    const kind = block.kind === 'reasoning' ? 'reasoning' : block.kind === 'text' ? 'text' : null;
    if (kind == null) continue;
    const text = typeof block.text === 'string' ? block.text : '';
    if (text.trim() === '') continue;
    const previous = runs[runs.length - 1];
    if (previous && previous.kind === kind) previous.text += '\n' + text;
    else runs.push({ kind, text });
  }
  return runs;
}

/** Merge consecutive assistant blocks into reasoning / text runs. */
function splitBlocks(blocks) {
  return assistantRuns(blocks).filter((run) => run.kind !== 'tool-call');
}

/** Pretty-print arguments for the raw-details disclosure. */
function argsTextOf(rawArgs, args) {
  if (typeof rawArgs === 'string' && rawArgs.trim() !== '') return clip(rawArgs, 4000);
  try {
    return clip(JSON.stringify(args, null, 2), 4000);
  } catch (error) {
    return '';
  }
}

function toolStartTime(tool) {
  return tool.result?.callTime ?? tool.running?.time ?? null;
}

/** Index the available representations of each call, including explicit child calls. */
function indexTools(nodes, liveCalls, partial) {
  const tools = new Map();
  function ensureTool(callId) {
    if (!tools.has(callId)) {
      tools.set(callId, { callId, parentCallId: null, children: [], priorReasoning: '', requestTime: null });
    }
    return tools.get(callId);
  }
  function registerSource(source, fallbackId, parentCallId) {
    if (!source || typeof source !== 'object') return;
    const tool = ensureTool(source.callId || fallbackId);
    const parentId = source.parentCallId || parentCallId;
    if (parentId && parentId !== tool.callId) tool.parentCallId = parentId;
    if (source.kind === 'tool-result') tool.result = source;
    else if (source.phase) tool.running = source;
    else tool.nestedRequest = source;
    if (!Array.isArray(source.subCalls)) return;
    source.subCalls.forEach((child, index) => registerSource(child, tool.callId + '-child-' + index, tool.callId));
  }
  function registerRequests(node, streaming = false) {
    if (!Array.isArray(node?.blocks)) return;
    for (const block of node.blocks) {
      if (block?.kind !== 'tool-call' || !block.callId) continue;
      const tool = ensureTool(block.callId);
      if (streaming) tool.streamingRequest = true;
      if (tool.request) continue;
      tool.request = block;
      tool.requestTime = typeof node.time === 'number' ? node.time : null;
      tool.interrupted = node.interrupted === true;
    }
  }
  for (const node of nodes) {
    if (node?.kind === 'assistant') registerRequests(node);
    if (node?.kind === 'tool-result') registerSource(node, 'call-' + node.seq, null);
  }
  for (const call of liveCalls) registerSource(call, call.callId, null);
  registerRequests(partial, true);

  for (const tool of tools.values()) {
    const parent = tools.get(tool.parentCallId);
    if (parent) parent.children.push(tool);
  }
  return tools;
}

/** Combine a request, live call, and recorded outcome into a single action. */
function makeToolItem(tool, guide, lang, live) {
  const { callId, result, running, parentCallId, priorReasoning } = tool;
  const request = tool.request || tool.nestedRequest;
  const name = result?.name || result?.call?.name || running?.name || request?.name || 'tool';
  const rawArgs = result?.call?.argsRaw || running?.argsRaw || request?.argsRaw || '';
  const args = parseArgs(rawArgs, result?.args ?? running?.args);
  const meta = guide && guide.tools ? guide.tools[name] : null;
  const category = meta && typeof meta.category === 'string' ? meta.category : 'other';
  let status = 'unknown';
  if (result) status = result.error?.code === 'interrupted' ? 'interrupted' : result.isError ? 'error' : 'ok';
  else if (running?.phase === 'start' && live) status = 'running';
  else if (tool.interrupted) status = 'interrupted';
  else if (live && (running?.phase === 'preparing' || tool.streamingRequest)) status = 'pending';
  const duration = typeof result?.callTime === 'number' && typeof result?.time === 'number'
    ? Math.max(0, result.time - result.callTime)
    : null;
  const children = tool.children.map((child) => makeToolItem(child, guide, lang, live && !result));
  return {
    key: 'tool-' + callId,
    kind: 'tool',
    group: 'tool',
    icon: categoryIcon(category),
    category,
    callId,
    parentCallId,
    name,
    title: meta ? pick(meta.title, lang) : name,
    subject: subjectOf(name, args),
    what: meta ? pick(meta.what, lang) : '',
    why: meta ? pick(meta.why, lang) : '',
    args,
    description: typeof args.description === 'string' ? args.description.trim() : '',
    priorReasoning,
    status,
    duration,
    time: toolStartTime(tool) ?? tool.requestTime ?? result?.time ?? null,
    argsText: argsTextOf(rawArgs, args),
    result: textOfContent(result?.content),
    error: result?.error
      ? [result.error.name, result.error.code, result.error.reason].filter(Boolean).join(' · ')
      : '',
    subCalls: children.reduce((count, child) => count + 1 + child.subCalls, 0),
    children,
  };
}

function toolErrors(item) {
  if (item.kind !== 'tool') return 0;
  return item.children.reduce((count, child) => count + toolErrors(child), Number(item.status === 'error'));
}

function assistantTextItem(run, index, node, streaming) {
  const seq = typeof node.seq === 'number' ? node.seq : 0;
  const reasoning = run.kind === 'reasoning';
  const prefix = reasoning ? 'think-' : 'answer-';
  return {
    key: streaming ? 'partial-' + prefix + index : prefix + seq + '-' + index,
    kind: reasoning ? 'think' : 'message',
    group: reasoning ? 'think' : 'answer',
    icon: reasoning ? '🧠' : '💬',
    text: run.text,
    streaming,
    interrupted: node.interrupted === true,
    time: typeof node.time === 'number' ? node.time : null,
  };
}

/** Turn one durable event into its display notes. */
function noteItems(node) {
  const seq = typeof node.seq === 'number' ? node.seq : 0;
  const time = typeof node.time === 'number' ? node.time : null;

  if (node.kind === 'steering') {
    const text = textOfContent(node.content);
    if (text.trim() === '') return [];
    return [
      {
        key: 'steer-' + seq,
        kind: 'note',
        group: 'misc',
        icon: '💬',
        noteKind: 'steering',
        text,
        detail: '',
        tone: 'neutral',
        time,
      },
    ];
  }

  if (node.kind === 'context') {
    const producer = node.producer;
    const producerLabel =
      typeof producer === 'string'
        ? producer
        : producer && typeof producer === 'object'
          ? producer.name || producer.title || producer.role || ''
          : '';
    return [
      {
        key: 'note-context-' + seq,
        kind: 'note',
        group: 'misc',
        icon: '🧩',
        noteKind: 'context',
        text: typeof producerLabel === 'string' ? producerLabel : '',
        detail: textOfContent(node.content),
        tone: 'neutral',
        time,
      },
    ];
  }

  if (node.kind === 'command') {
    const name = typeof node.name === 'string' ? node.name : '';
    const args = typeof node.args === 'string' ? node.args : '';
    return [
      {
        key: 'note-command-' + seq,
        kind: 'note',
        group: 'misc',
        icon: '⌘',
        noteKind: 'command',
        text: (name + ' ' + args).trim(),
        detail: node.outcome && typeof node.outcome.text === 'string' ? node.outcome.text : '',
        tone: node.outcome && node.outcome.kind === 'error' ? 'warn' : 'neutral',
        time,
      },
    ];
  }

  if (node.kind === 'compaction') {
    return [
      {
        key: 'note-compaction-' + seq,
        kind: 'note',
        group: 'misc',
        icon: '🗜️',
        noteKind: 'compaction',
        text: '',
        count: typeof node.shadowedItemCount === 'number' ? node.shadowedItemCount : null,
        detail: typeof node.summary === 'string' ? node.summary : '',
        tone: 'neutral',
        time,
      },
    ];
  }

  if (node.kind === 'model-retry') {
    const current = node.current && typeof node.current === 'object' ? node.current : null;
    const attempts = Array.isArray(node.attempts) ? node.attempts : null;
    return [
      {
        key: 'note-retry-' + seq,
        kind: 'note',
        group: 'misc',
        icon: '📡',
        noteKind: 'retry',
        text:
          (current && (current.message || current.code || current.reason)) ||
          (node.retryState === 'cancelled' ? 'cancelled' : ''),
        count: attempts ? attempts.length : null,
        detail: '',
        tone: 'warn',
        time,
      },
    ];
  }

  if (node.kind === 'turn-error') {
    return [
      {
        key: 'note-error-' + seq,
        kind: 'note',
        group: 'misc',
        icon: '⚠️',
        noteKind: 'error',
        text: node.message || node.code || '',
        detail: '',
        tone: 'error',
        time,
      },
    ];
  }

  if (node.kind === 'turn-max-tokens') {
    return [
      {
        key: 'note-maxtokens-' + seq,
        kind: 'note',
        group: 'misc',
        icon: '📏',
        noteKind: 'maxTokens',
        text: '',
        detail: '',
        tone: 'warn',
        time,
      },
    ];
  }

  return [
    {
      key: 'note-unknown-' + seq,
      kind: 'note',
      group: 'misc',
      icon: '🔎',
      noteKind: 'unknown',
      text: typeof node.type === 'string' ? node.type : '',
      detail: '',
      tone: 'neutral',
      time,
    },
  ];
}

const PHASE_OF_CATEGORY = {
  read: 'collect',
  search: 'collect',
  web: 'collect',
  write: 'modify',
  run: 'verify',
  deliver: 'deliver',
  collab: 'collab',
  other: 'other',
};

const PHASE_ORDER = ['collect', 'modify', 'verify', 'deliver', 'collab', 'other'];

function emptyCategoryCounts() {
  return { read: 0, search: 0, write: 0, run: 0, web: 0, collab: 0, deliver: 0, other: 0 };
}

function summarizeCategories(categoryCounts) {
  const phases = [];
  for (const phase of PHASE_ORDER) {
    let count = 0;
    for (const category of Object.keys(categoryCounts)) {
      if (PHASE_OF_CATEGORY[category] === phase) count += categoryCounts[category] || 0;
    }
    if (count > 0) phases.push({ phase, count });
  }
  return phases;
}

function lastItemOfKind(items, kind) {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (items[index] && items[index].kind === kind) return items[index];
  }
  return null;
}

function findTurnDescriptorIndex(descriptors, turn) {
  for (let index = 0; index < descriptors.length; index += 1) {
    if (descriptors[index].turn === turn) return index;
  }
  return -1;
}

/** Human duration for one step (`0.4s`, `12s`, `2m 05s`). */
function formatDuration(ms, lang) {
  if (typeof ms !== 'number' || !isFinite(ms) || ms < 0) return '';
  if (ms < 1000) return lang === 'zh' ? ms + ' 毫秒' : ms + 'ms';
  if (ms < 60000) {
    const seconds = ms / 1000;
    return lang === 'zh' ? seconds.toFixed(1) + ' 秒' : seconds.toFixed(1) + 's';
  }
  return formatClock(ms, lang);
}

/** Human duration for a whole turn (`1m 20s` / `1 分 20 秒`). */
function formatClock(ms, lang) {
  if (typeof ms !== 'number' || !isFinite(ms) || ms < 0) ms = 0;
  const total = Math.round(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  if (lang === 'zh') {
    if (minutes === 0) return seconds + ' 秒';
    return minutes + ' 分 ' + String(seconds).padStart(2, '0') + ' 秒';
  }
  if (minutes === 0) return seconds + 's';
  return minutes + 'm ' + String(seconds).padStart(2, '0') + 's';
}

/**
 * Build the whole turn-organized model from one Chat snapshot.
 *
 * @param {object} state - `nodes`, `runningCalls`, `partial`, `timeline` from the
 *   conversation snapshot, the active language, and the tool guide.
 * @returns {{turns: Array<object>}} turns in ascending order; the last one is current.
 */
function buildTurnModel(state) {
  const input = state && typeof state === 'object' ? state : {};
  const nodes = Array.isArray(input.nodes) ? input.nodes : [];
  const runningCalls = Array.isArray(input.runningCalls) ? input.runningCalls : [];
  const partial = input.partial && typeof input.partial === 'object' ? input.partial : null;
  const timeline = input.timeline && typeof input.timeline === 'object' ? input.timeline : null;
  const guide = input.guide && typeof input.guide === 'object' ? input.guide : { tools: {} };
  const lang = input.lang === 'zh' ? 'zh' : 'en';

  // Calls that already have a result must not be rendered twice.
  const settledCallIds = new Set();
  for (const node of nodes) {
    if (node && node.kind === 'tool-result' && typeof node.callId === 'string') settledCallIds.add(node.callId);
  }
  const liveCalls = runningCalls.filter(
    (call) => call && typeof call === 'object' && typeof call.callId === 'string' && !settledCallIds.has(call.callId),
  );

  // ---------------------------------------------------------------- turn list
  const descriptors = [];
  const seen = new Set();
  function pushTurn(turn, location = null) {
    if (typeof turn !== 'number' || seen.has(turn)) return;
    seen.add(turn);
    descriptors.push({ turn, location });
  }
  if (timeline && Array.isArray(timeline.turnOrder) && timeline.turnOrder.length > 0) {
    for (const turn of timeline.turnOrder) {
      const location =
        timeline.turns && typeof timeline.turns.get === 'function' ? timeline.turns.get(turn) : null;
      pushTurn(turn, location);
    }
  }
  for (const node of nodes) {
    if (node?.kind === 'assistant' || node?.kind === 'turn-error') pushTurn(node.turn);
  }
  for (const call of liveCalls) pushTurn(call.turn);
  if (partial) pushTurn(partial.turn);
  if (descriptors.length === 0 && (nodes.length > 0 || liveCalls.length > 0 || partial)) {
    pushTurn(1);
  }
  descriptors.sort((left, right) => left.turn - right.turn);

  descriptors.forEach((descriptor, index) => {
    const location = descriptor.location;
    descriptor.startSeq =
      location && location.start && typeof location.start.seq === 'number' ? location.start.seq : null;
    descriptor.endSeq =
      location && location.end && typeof location.end.seq === 'number' ? location.end.seq : null;
    descriptor.startTime =
      location && location.start && typeof location.start.time === 'number' ? location.start.time : null;
    descriptor.endTime =
      location && location.end && typeof location.end.time === 'number' ? location.end.time : null;
    descriptor.status = location && typeof location.status === 'string' ? location.status : null;
    descriptor.lower = descriptor.startSeq;
    const next = descriptors[index + 1];
    descriptor.upper = next && next.startSeq !== null ? next.startSeq - 1 : Infinity;
    if (descriptor.lower === null) {
      if (index === 0) descriptor.lower = -Infinity;
      else {
        const previous = descriptors[index - 1];
        descriptor.lower = previous.endSeq !== null ? previous.endSeq : previous.lower;
      }
    }
  });

  function descriptorIndexForSeq(seq, kind) {
    if (typeof seq !== 'number') return -1;
    if (kind === 'user') {
      let bestIndex = -1;
      let bestSeq = Infinity;
      for (let index = 0; index < descriptors.length; index += 1) {
        const startSeq = descriptors[index].startSeq;
        if (startSeq !== null && startSeq > seq && startSeq < bestSeq) {
          bestIndex = index;
          bestSeq = startSeq;
        }
      }
      // A loaded assistant message can identify a turn with a missing start.
      for (const peer of nodes) {
        if (
          peer &&
          peer.kind === 'assistant' &&
          typeof peer.seq === 'number' &&
          typeof peer.turn === 'number' &&
          peer.seq > seq &&
          peer.seq < bestSeq
        ) {
          bestSeq = peer.seq;
          bestIndex = findTurnDescriptorIndex(descriptors, peer.turn);
        }
      }
      if (bestIndex >= 0) return bestIndex;
      return descriptors.length - 1;
    }
    for (let index = descriptors.length - 1; index >= 0; index -= 1) {
      const descriptor = descriptors[index];
      if (descriptor.startSeq !== null && descriptor.startSeq <= seq) {
        if (seq <= descriptor.upper) return index;
        if (index === descriptors.length - 1) return index;
      }
    }
    // No turn/start coordinates in the loaded window: infer from the previous assistant message.
    let bestIndex = -1;
    let bestSeq = -Infinity;
    for (const peer of nodes) {
      if (
        peer &&
        peer.kind === 'assistant' &&
        typeof peer.seq === 'number' &&
        typeof peer.turn === 'number' &&
        peer.seq <= seq &&
        peer.seq > bestSeq
      ) {
        bestSeq = peer.seq;
        bestIndex = findTurnDescriptorIndex(descriptors, peer.turn);
      }
    }
    if (bestIndex >= 0) return bestIndex;
    return descriptors.length > 0 ? 0 : -1;
  }

  function descriptorIndexForNode(node) {
    if (!node || typeof node !== 'object') return -1;
    if (typeof node.turn === 'number') {
      const index = findTurnDescriptorIndex(descriptors, node.turn);
      if (index >= 0) return index;
    }
    return descriptorIndexForSeq(node.seq, node.kind);
  }

  // -------------------------------------------------------------- turn groups
  const groups = descriptors.map(() => ({ nodes: [], goalNodes: [] }));
  for (const node of nodes) {
    if (!node || typeof node !== 'object') continue;
    const index = descriptorIndexForNode(node);
    if (index < 0) continue;
    if (node.kind === 'user') groups[index].goalNodes.push(node);
    else groups[index].nodes.push(node);
  }

  const latestIndex = descriptors.length - 1;
  const latest = descriptors[latestIndex];
  const mayBeLive = !!latest && latest.status !== 'closed' && latest.endSeq === null &&
    !groups[latestIndex].nodes.some((node) => node.kind === 'turn-error');
  const activePartial = mayBeLive && partial?.turn === latest.turn ? partial : null;
  const tools = indexTools(nodes, liveCalls, activePartial);
  const isRootTool = (tool) => tool && !tools.has(tool.parentCallId);

  // --------------------------------------------------------------- turn build
  const turns = descriptors.map((descriptor, turnIndex) => {
    const location = descriptor.location;
    const stepLocations = location && Array.isArray(location.steps) ? location.steps : null;
    const steps = new Map();
    const isCurrent = turnIndex === latestIndex;
    const canRun = isCurrent && mayBeLive;
    const turnPartial = isCurrent ? activePartial : null;

    function ensureStep(stepNumber) {
      if (!steps.has(stepNumber)) {
        steps.set(stepNumber, {
          step: stepNumber,
          startSeq: null,
          endSeq: null,
          startTime: null,
          endTime: null,
          lower: null,
          upper: null,
          status: 'unknown',
          items: [],
        });
      }
      return steps.get(stepNumber);
    }

    if (stepLocations && stepLocations.length > 0) {
      stepLocations.forEach((stepLocation, index) => {
        const entry = ensureStep(stepLocation.step);
        entry.startSeq =
          stepLocation.start && typeof stepLocation.start.seq === 'number' ? stepLocation.start.seq : null;
        entry.endSeq =
          stepLocation.end && typeof stepLocation.end.seq === 'number' ? stepLocation.end.seq : null;
        entry.startTime =
          stepLocation.start && typeof stepLocation.start.time === 'number' ? stepLocation.start.time : null;
        entry.endTime =
          stepLocation.end && typeof stepLocation.end.time === 'number' ? stepLocation.end.time : null;
        entry.status =
          typeof stepLocation.status === 'string'
            ? stepLocation.status
            : entry.endSeq !== null
              ? 'closed'
              : 'open';
        entry.lower = entry.startSeq !== null ? entry.startSeq : index === 0 ? descriptor.lower : null;
        const next = stepLocations[index + 1];
        const nextStart = next && next.start && typeof next.start.seq === 'number' ? next.start.seq : null;
        entry.upper = nextStart !== null ? nextStart - 1 : descriptor.upper;
      });
    }

    function stepForNode(node) {
      if (typeof node.step === 'number') return ensureStep(node.step);
      if (steps.size > 0 && typeof node.seq === 'number') {
        for (const entry of steps.values()) {
          if (
            entry.lower !== null &&
            node.seq >= entry.lower &&
            (entry.upper === null || entry.upper === Infinity || node.seq <= entry.upper)
          ) {
            return entry;
          }
        }
        let fallback = null;
        for (const entry of steps.values()) {
          if (entry.lower !== null && node.seq >= entry.lower && (fallback === null || entry.lower > fallback.lower)) fallback = entry;
        }
        if (fallback) return fallback;
      }
      if (typeof node.seq === 'number') {
        let bestStep = 1;
        let bestSeq = -Infinity;
        for (const peer of groups[turnIndex].nodes) {
          if (peer && peer.kind === 'assistant' && typeof peer.step === 'number' && typeof peer.seq === 'number') {
            if (peer.seq <= node.seq && peer.seq > bestSeq) {
              bestSeq = peer.seq;
              bestStep = peer.step;
            }
          }
        }
        return ensureStep(bestStep);
      }
      return ensureStep(1);
    }

    function addAssistantItems(entry, node, streaming) {
      let priorReasoning = '';
      for (const [index, run] of assistantRuns(node.blocks).entries()) {
        if (run.kind === 'tool-call') {
          const tool = tools.get(run.block.callId);
          if (isRootTool(tool) && tool.request === run.block) {
            tool.priorReasoning = priorReasoning;
            entry.items.push(makeToolItem(tool, guide, lang, canRun));
          }
        } else {
          if (run.kind === 'reasoning') priorReasoning = run.text;
          entry.items.push(assistantTextItem(run, index, node, streaming));
        }
      }
    }

    function addUnmatchedTool(entry, tool) {
      const item = makeToolItem(tool, guide, lang, canRun);
      const start = toolStartTime(tool);
      // Keep event order when no request or tool-start position is available.
      const next = typeof start === 'number'
        ? entry.items.findIndex((existing) => typeof existing.time === 'number' && existing.time > start)
        : -1;
      if (next === -1) entry.items.push(item);
      else entry.items.splice(next, 0, item);
    }

    function stepForToolResult(node) {
      let match = null;
      if (typeof node.callTime === 'number') {
        for (const step of steps.values()) {
          if (step.startTime !== null && step.startTime <= node.callTime &&
              (step.endTime === null || node.callTime <= step.endTime) &&
              (!match || step.startTime > match.startTime)) {
            match = step;
          }
        }
      }
      return match || stepForNode(node);
    }

    for (const node of groups[turnIndex].nodes) {
      if (node.kind === 'assistant') {
        addAssistantItems(stepForNode(node), node, false);
      } else if (node.kind === 'tool-result') {
        const tool = tools.get(node.callId || 'call-' + node.seq);
        if (isRootTool(tool) && !tool.request && tool.result === node) {
          addUnmatchedTool(stepForToolResult(node), tool);
        }
      } else {
        stepForNode(node).items.push(...noteItems(node));
      }
    }

    // A call can start before the corresponding assistant block is visible.
    for (const call of liveCalls) {
      if (call.turn !== descriptor.turn) continue;
      const tool = tools.get(call.callId);
      if (!isRootTool(tool) || tool.request || tool.result || tool.running !== call) continue;
      const entry =
        typeof call.step === 'number' ? ensureStep(call.step) : ensureStep(Math.max(1, ...Array.from(steps.keys())));
      addUnmatchedTool(entry, tool);
    }

    // Streaming assistant output of the current turn.
    if (turnPartial) {
      const entry =
        typeof turnPartial.step === 'number' ? ensureStep(turnPartial.step) : ensureStep(Math.max(1, ...Array.from(steps.keys())));
      addAssistantItems(entry, turnPartial, true);
    }

    // ---------------------------------------------------------- step summary
    const orderedSteps = Array.from(steps.values())
      .sort((left, right) => left.step - right.step)
      .map((entry) => ({
        step: entry.step,
        status: entry.status,
        live: false,
        startTime: entry.startTime,
        endTime: entry.endTime,
        thinkCount: entry.items.filter((item) => item.kind === 'think').length,
        toolCount: entry.items.filter((item) => item.kind === 'tool').length,
        toolErrorCount: entry.items.reduce((count, item) => count + toolErrors(item), 0),
        messageCount: entry.items.filter((item) => item.kind === 'message').length,
        hasError: entry.items.some((item) => item.kind === 'note' && item.tone === 'error'),
        running: entry.items.some((item) => item.kind === 'tool' && item.status === 'running'),
        pending: entry.items.some((item) => item.kind === 'tool' && item.status === 'pending'),
        items: entry.items,
      }));

    const categoryCounts = emptyCategoryCounts();
    let toolCount = 0;
    for (const step of orderedSteps) {
      for (const item of step.items) {
        if (item.kind === 'tool') {
          toolCount += 1;
          if (categoryCounts[item.category] != null) categoryCounts[item.category] += 1;
        }
      }
    }

    const goalNodes = groups[turnIndex].goalNodes
      .map((node) => ({
        kind: node.kind === 'user' ? 'user' : 'steer',
        text: textOfContent(node.content),
        time: typeof node.time === 'number' ? node.time : null,
      }))
      .filter((entry) => entry.text.trim() !== '');
    const goal = goalNodes
      .map((entry) => entry.text)
      .join('\n')
      .trim();

    const allItems = [];
    for (const step of orderedSteps) for (const item of step.items) allItems.push(item);

    const hasError = allItems.some((item) => item.kind === 'note' && item.tone === 'error');

    let activity = 'done';
    if (canRun && orderedSteps.some((step) => step.running || step.pending)) activity = 'acting';
    else if (turnPartial) {
      const runs = splitBlocks(turnPartial.blocks);
      activity = runs.some((run) => run.kind === 'text') ? 'answering' : 'thinking';
    } else if (canRun && descriptor.startSeq !== null && orderedSteps.length > 0) {
      const lastStep = orderedSteps[orderedSteps.length - 1];
      if (lastStep.status === 'open' || lastStep.status === 'unknown') activity = 'thinking';
    } else if (canRun && descriptor.startSeq !== null && orderedSteps.length === 0) {
      activity = 'starting';
    }
    if (canRun && descriptor.status === 'open' && activity === 'done') activity = 'thinking';
    if (hasError) activity = 'error';

    const live = canRun && activity !== 'done';
    if (live && orderedSteps.length > 0) {
      for (const step of orderedSteps) step.live = step.running || step.pending;
      const activeStep = orderedSteps.find((step) => step.step === turnPartial?.step);
      if (activeStep) activeStep.live = true;
      if (!orderedSteps.some((step) => step.live)) orderedSteps[orderedSteps.length - 1].live = true;
    }

    const lastThink = lastItemOfKind(allItems, 'think');
    const lastAnswer = lastItemOfKind(allItems, 'message');
    const firstThink = allItems.find((item) => item.kind === 'think') || null;
    const lastRunningTool = (() => {
      for (let index = allItems.length - 1; index >= 0; index -= 1) {
        const item = allItems[index];
        if (item.kind === 'tool' && item.status === 'running') return item;
      }
      return null;
    })();

    const firstStepWithStart = orderedSteps.find((step) => step.startTime !== null);
    const startTime =
      descriptor.startTime !== null
        ? descriptor.startTime
        : firstStepWithStart
          ? firstStepWithStart.startTime
          : goalNodes.length > 0
            ? goalNodes[goalNodes.length - 1].time
            : null;
    const endTime = descriptor.endTime;

    return {
      turn: descriptor.turn,
      index: turnIndex,
      status: descriptor.status || 'unknown',
      isCurrent,
      live,
      activity,
      hasError,
      goal,
      goalNodes,
      steps: orderedSteps,
      stepCount: orderedSteps.length,
      toolCount,
      toolErrorCount: orderedSteps.reduce((count, step) => count + step.toolErrorCount, 0),
      categoryCounts,
      phases: summarizeCategories(categoryCounts),
      thoughts: allItems.filter((item) => item.kind === 'think').length,
      answers: allItems.filter((item) => item.kind === 'message').length,
      startTime,
      endTime,
      durationMs: startTime !== null && endTime !== null ? Math.max(0, endTime - startTime) : null,
      liveThink: lastThink ? { text: lastThink.text, streaming: lastThink.streaming === true } : null,
      liveAnswer:
        activity === 'answering' && lastAnswer
          ? { text: lastAnswer.text, streaming: lastAnswer.streaming === true }
          : null,
      liveTool: lastRunningTool,
      lastAnswer: lastAnswer ? lastAnswer.text : '',
      openingThought: firstThink ? firstThink.text : '',
      items: allItems,
    };
  });

  return { turns };
}




const ACTION_PROGRAMS = {
  notepad: ['记事本', 'Notepad'],
  explorer: ['文件资源管理器', 'File Explorer'],
  msedge: ['Microsoft Edge', 'Microsoft Edge'],
  chrome: ['Chrome', 'Chrome'],
  firefox: ['Firefox', 'Firefox'],
  mspaint: ['画图', 'Paint'],
  calc: ['计算器', 'Calculator'],
  code: ['VS Code', 'VS Code'],
  winword: ['Word', 'Word'],
  excel: ['Excel', 'Excel'],
  powerpnt: ['PowerPoint', 'PowerPoint'],
  wt: ['Windows 终端', 'Windows Terminal'],
};

// Recognize the first direct invocation, without executing or inspecting nested
// scripts. Subsequent statements, quoted command examples and comments are not
// evidence that a particular command ran.
function recordedCommandWords(source, powershell) {
  const input = source.slice(0, 4096).trimStart()
    .replace(/^(?:(?:#[^\r\n]*(?:\r?\n|$)|<#[\s\S]*?#>)\s*)+/, '');
  // A bare quoted string is an expression in PowerShell, while "& 'path'"
  // explicitly invokes a program.
  if (powershell && /^["']/.test(input)) return [];
  const command = powershell ? input.replace(/^&[ \t]+/, '') : input;
  const token = /(?:[^ \t\r\n"';|&<>(){}`]+|"(?:[^"`]|`.)*"|'(?:[^']|'')*')+/y;
  const words = [];
  let index = 0;
  while (words.length < 48) {
    while (command[index] === ' ' || command[index] === '\t') index += 1;
    token.lastIndex = index;
    const match = token.exec(command);
    if (!match) break;
    words.push(match[0]);
    index = token.lastIndex;
  }
  return words;
}

function actionLiteral(word) {
  if (!word || /[\r\n]/.test(word)) return '';
  if (word.startsWith("'") && word.endsWith("'")) return word.slice(1, -1).replace(/''/g, "'");
  const text = word.startsWith('"') && word.endsWith('"') ? word.slice(1, -1) : word;
  return /[\r\n$`"{}]|%[^%]+%/.test(text) ? '' : text;
}

function actionOption(words, ...names) {
  for (const [index, word] of words.entries()) {
    const separator = word.search(/[:=]/);
    const option = (separator < 0 ? word : word.slice(0, separator)).toLowerCase();
    if (names.includes(option)) return actionLiteral(separator < 0 ? words[index + 1] : word.slice(separator + 1));
  }
  return '';
}

function actionPath(words) {
  const explicit = actionOption(words, '-literalpath', '-path', '-filepath', '-file', '-f', '--file');
  const positional = words[0] && !words[0].startsWith('-') ? actionLiteral(words[0]) : '';
  return basename(explicit || positional);
}

function actionHost(target) {
  if (!/^https?:\/\//i.test(target)) return '';
  try {
    return new URL(target).hostname;
  } catch {
    return '';
  }
}

function programAction(program, target, locale) {
  const name = basename(program);
  const key = name.toLowerCase().replace(/\.exe$/, '');
  const app = Object.hasOwn(ACTION_PROGRAMS, key) ? ACTION_PROGRAMS[key] : null;
  const subject = actionHost(target) || (target && !/^[-/]\w+(?:\s|$)/.test(target) ? basename(target) : '');
  if (app) {
    return { title: (locale === 0 ? '打开' : 'Open ') + app[locale], subject: clip(subject, 65) };
  }
  return { title: locale === 0 ? '启动程序' : 'Start a program', subject: clip(name, 65) };
}

/** Human-readable action derived from a recorded shell request's literal data. */
function describeRecordedAction(item, lang) {
  const source = item?.args?.command;
  if (typeof source !== 'string') return null;
  const [command, ...words] = recordedCommandWords(source, item.name === 'pwsh');
  const program = actionLiteral(command);
  const exe = basename(program).toLowerCase();
  const name = exe.replace(/\.exe$/, '');
  const first = actionLiteral(words[0]);
  const locale = lang === 'zh' ? 0 : 1;
  const summary = (zh, en, subject = '') => ({ title: locale === 0 ? zh : en, subject: clip(subject, 65) });

  if (name === 'start-process' || (item.name === 'pwsh' && ['start', 'saps'].includes(name))) {
    const target = actionOption(words, '-filepath') || (first.startsWith('-') ? '' : first);
    if (!target || target.startsWith('-')) return summary('启动程序', 'Start a program');
    const host = actionHost(target);
    if (host) return summary('打开网页', 'Open a web page', host);
    if (target.toLowerCase().startsWith('ms-settings:')) return summary('打开 Windows 设置', 'Open Windows Settings');
    if (/\.(?!exe$|com$|cmd$|bat$)[a-z0-9]{1,8}$/i.test(target)) {
      return summary('打开文件', 'Open a file', basename(target));
    }
    const argument = actionOption(words, '-argumentlist', '-args');
    return programAction(target, argument, locale);
  }
  if (['invoke-item', 'ii'].includes(name)) return summary('打开文件或目录', 'Open a file or folder', actionPath(words));
  if (Object.hasOwn(ACTION_PROGRAMS, name) && (exe.endsWith('.exe') || ['explorer', 'code', 'notepad'].includes(name))) {
    if (words.some((word) => /^(?:--?|\s*\/)(?:help|version|list-extensions|install-extension|uninstall-extension)$/.test(word))) {
      return summary('运行程序', 'Run a program', ACTION_PROGRAMS[name][locale]);
    }
    const target = first.replace(/^\/select,/, '');
    return programAction(program, target, locale);
  }

  if (['get-content', 'cat'].includes(name)) return summary('读取文件', 'Read a file', actionPath(words));
  if (['get-childitem', 'ls', 'dir'].includes(name)) return summary('列出目录内容', 'List folder contents', actionPath(words));
  if (['test-path', 'get-item'].includes(name)) return summary('检查路径', 'Check a path', actionPath(words));
  if (['get-process', 'tasklist'].includes(name)) {
    return summary('检查运行中的程序', 'Check running programs', actionOption(words, '-name', '-processname') || (first.startsWith('-') ? '' : first));
  }
  if (['get-command', 'where'].includes(name)) {
    return summary('查找可用程序', 'Find an available program', actionOption(words, '-name') || (first.startsWith('-') ? '' : first));
  }
  if (name === 'rg' && words.includes('--files')) {
    return summary('查找文件路径', 'Find file paths', actionOption(words, '-g', '--glob'));
  }
  if (['rg', 'grep', 'select-string'].includes(name)) {
    const pattern = actionOption(words, '-e', '--regexp', '-pattern') || (first.startsWith('-') ? '' : first);
    return summary('搜索文本', 'Search text', pattern);
  }
  if (['invoke-webrequest', 'invoke-restmethod', 'curl'].includes(name)) {
    return summary('请求网页', 'Request a web page', actionHost(actionOption(words, '-uri') || first));
  }
  if (name === 'git') {
    const gitArgs = words[0] === '-C' ? words.slice(2) : words;
    if (gitArgs[0] === 'status') return summary('查看 Git 状态', 'Check Git status');
    if (gitArgs[0] === 'diff') return summary('查看代码差异', 'Inspect changes');
  }
  if (name === 'node' && first === '--test') {
    return summary('运行测试', 'Run tests', words[1] && !words[1].startsWith('-') ? basename(actionLiteral(words[1])) : '');
  }
  if (name === 'node' && basename(first) === 'build.mjs') return summary('构建项目', 'Build the project', 'build.mjs');
  if (['npm', 'npm.cmd', 'pnpm', 'pnpm.cmd', 'yarn', 'yarn.cmd'].includes(name)) {
    const script = first === 'run' ? actionLiteral(words[1]) : first;
    if (script === 'test') return summary('运行测试', 'Run tests');
    if (script === 'build') return summary('构建项目', 'Build the project');
  }
  if (['node', 'python', 'python3', 'pwsh', 'powershell'].includes(name)) {
    const script = actionPath(words);
    if (/\.(?:c?js|mjs|py|ps1)$/i.test(script)) return summary('运行脚本', 'Run a script', script);
  }
  if (exe.endsWith('.exe')) return summary('运行程序', 'Run a program', basename(program));
  return null;
}


const reasoningSentenceSegmenter = typeof Intl.Segmenter === 'function'
  ? new Intl.Segmenter('en', { granularity: 'sentence' })
  : null;

const reasoningActionCues = {
  read: /\b(?:read|open|inspect|review|examine|look at|load)\b/i,
  search: /\b(?:search|look for|look up|find|locate|grep|identify)\b/i,
  write: /\b(?:write|edit|modify|update|patch|change|add|replace|save)\b/i,
  run: /\b(?:run|execute|test|build|verify|compare|check)\b/i,
  web: /\b(?:search|look up|browse|fetch|visit|open)\b/i,
  collab: /\b(?:delegate|assign|ask|spawn|coordinate|send)\b/i,
  deliver: /\b(?:deliver|present|share|export|attach)\b/i,
};

const reasoningToolCategories = { grep: 'search', glob: 'search', edit: 'write', pwsh: 'run', bash: 'run' };
const reasoningWhyCue = /\b(?:because|so that|in order to|need to|should first|first need|before (?:we|I|making|changing)|to (?:confirm|verify|find|determine|see|understand|identify|check|ensure|avoid))\b/i;
const reasoningEnglishCue = /\b(?:a|an|the|to|and|or|of|for|with|is|are|this|that|it|I|we|because)\b/i;
const reasoningTargetStopWords = new Set(['the', 'and', 'file', 'files', 'folder', 'test', 'tests', 'read', 'run']);

function reasoningWords(text) {
  return (text.toLowerCase().match(/[a-z][a-z0-9_.-]*/g) || []).map((word) => word.replace(/[.-]+$/, ''));
}

function reasoningTargets(action) {
  const args = action?.args || {};
  const subject = action?.subject === action?.description ? null : action?.subject;
  const values = [subject, args.file_path, args.path, args.pattern, args.query];
  return new Set(values
    .filter((value) => typeof value === 'string' && value.length <= 180)
    .flatMap((value) => reasoningWords(value.split(/[\\/]/).pop()))
    .filter((word) => word.length >= 3 && !reasoningTargetStopWords.has(word)));
}

/** Pick a short, original English reasoning sentence for local translation. */
function selectReasoningExcerpt(text, action) {
  if (typeof text !== 'string' || !text) return '';
  const category = action?.category || reasoningToolCategories[action?.name] || action?.name;
  const actionCue = Object.hasOwn(reasoningActionCues, category) ? reasoningActionCues[category] : null;
  const targets = reasoningTargets(action);
  let best = '';
  let bestScore = 0;
  let fence = '';

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    const marker = line.match(/^(`{3,}|~{3,})/)?.[1];
    if (marker) {
      if (!fence) fence = marker;
      else if (line === marker && marker[0] === fence[0] && marker.length >= fence.length) fence = '';
      continue;
    }
    if (fence || !line || /^(?:\t| {4}|\s*[>{}\[\]`#])/.test(raw)) continue;
    const prose = line.replace(/^(?:[-*+]\s+|\d+[.)]\s+)/, '');
    const sentences = reasoningSentenceSegmenter
      ? Array.from(reasoningSentenceSegmenter.segment(prose), ({ segment }) => segment)
      : prose.split(/(?<=[.!?])\s+/);
    for (const part of sentences) {
      const sentence = part.trim();
      if (sentence.length < 12 || sentence.length > 320 || !reasoningEnglishCue.test(sentence)) continue;
      if (/^(?:(?:the )?user (?:asks?|asked|wants?|requests?|requested)|(?:const|let|var)\s+\w+\s*=)/i.test(sentence)) continue;
      const words = reasoningWords(sentence);
      const englishLetters = (sentence.match(/[a-z]/gi) || []).length;
      const allLetters = (sentence.match(/\p{L}/gu) || []).length;
      if (words.length < 4 || englishLetters * 3 < allLetters * 2) continue;

      const why = reasoningWhyCue.test(sentence);
      const matchingAction = actionCue?.test(sentence) === true;
      if (!why && !matchingAction) continue;
      if (actionCue && !matchingAction && Object.values(reasoningActionCues).some((cue) => cue.test(sentence))) continue;
      const matchingTarget = words.some((word) => targets.has(word));
      const score = 8 * Number(matchingAction) + 6 * Number(matchingTarget) + 3 * Number(why);
      if (score >= bestScore) {
        best = sentence;
        bestScore = score;
      }
    }
  }
  return best;
}


/**
 * React view for AI Step Lens, organized by conversation turn.
 *
 * Layout: a turn rail on the left (one chip per user request) and a detail pane
 * on the right that shows the recorded workflow for the selected turn. The build step concatenates this module
 * after `model.js` inside the bundle factory scope, so React, the model helpers
 * and the embedded GUIDE table are available here.
 */





const NS = 'learn';
const viewRuntime = { locale: null };
const EMPTY_LIST = [];

const STRINGS = {
  en: {
    "workflowTitle": "Turn workflow",
    overviewTitle: 'Realtime workflow map',
    quickFlowTitle: 'Live flow',
    quickFlowClose: 'Collapse',
    overviewHint: 'Select an action to open its zoomed detail.',
    overviewEmpty: 'Waiting for the first recorded step',
    overviewStart: 'Start',
    overviewEnd: 'Finished',
    overviewFailed: 'Turn failed',
    overviewReason: 'Reasoning',
    overviewPurpose: 'Description',
    stepDetails: 'Step details',
    actionReasoning: 'Related reasoning summary',
    translationUnavailable: 'Local reasoning translation is temporarily unavailable. The originals are available in each action’s details.',
    'status.pending': 'Preparing',
    "workflowHint": "Follow the recorded steps from top to bottom. Child actions appear under their parent action.",
    "requestStart": "Request received",
    "jumpToLive": "Go to active step",
    "recordedThinking": "Reasoning recorded",
    "answerRecorded": "Answer recorded",
    "thinkingExcerpt": "Reasoning excerpt",
    "originalThinking": "Original reasoning",
    "relatedThinking": "Related reasoning",
    "toolPurpose": "Tool purpose",
    "callDescription": "Call description",
    "toolFallback": "Tool call",
    "answerDetails": "Answer text",
    "viewDetails": "View details",
    "requestDetails": "Full request",
    "zoomTitle": "Zoomed detail",
    "zoomClose": "Close",
    "zoomHint": "The overview map clips long text. This view shows the step and its actions without clipping.",
    "zoomLocate": "Show in page",
    "zoomStep": "Step detail",
    "toolErrors": "{n} tool failures",
    "subActions": "Child actions",
    "resultMissing": "No result recorded",
    "status.unknown": "Status unknown",
    tab: 'AI Steps',
    title: 'AI Step Lens',
    subtitle: 'Follow the actions and recorded reasoning in each conversation turn',
    liveBadge: 'Live',
    idleBadge: 'Idle',
    turnRailTitle: 'Conversation turns',
    railFoot: 'Click a turn to review it',
    turnN: 'Turn {n}',
    currentTag: 'current',
    historyTag: 'history',
    backToCurrent: 'Back to current turn',
    previousTurn: 'Previous turn',
    goalLabel: 'Your request',
    untitledTurn: 'Untitled turn',
    metaSteps: '{n} steps',
    metaTools: '{n} tool calls',
    metaDuration: 'took {d}',
    elapsed: '{d} elapsed',
    interrupted: 'stopped',
    stepN: 'Step {k}/{total}',
    stepNumber: 'Step {k}',
    noSteps: 'No recorded steps in this turn yet.',
    argsLabel: 'Arguments',
    resultLabel: 'Result excerpt',
    errorLabel: 'Error',
    'status.thinking': 'thinking',
    'status.running': 'running',
    'status.done': 'done',
    'status.failed': 'failed',
    'status.error': 'error',
    'status.open': 'running',
    'status.closed': 'completed',
    'activity.thinking': 'thinking',
    'activity.acting': 'calling tools',
    'activity.answering': 'writing answer',
    'activity.starting': 'getting started',
    'activity.done': 'done',
    'activity.error': 'error',
    'note.context': 'System context injected',
    'note.command': 'Command executed',
    'note.compaction': 'Context compacted',
    'note.retry': 'Model request retried',
    'note.error': 'This turn failed',
    'note.maxTokens': 'Output length limit reached',
    'note.unknown': 'Other event',
    'note.steering': 'You added an instruction',
    countTimes: '{n} item(s)',
    turnCount: '{n} turns',
    toolCount: '{n} tool calls',
    emptyTitle: 'No conversation turns yet',
    emptyBody:
      'Send a request to see the workflow for each conversation turn.',
    liveHint: 'This turn is still running — the panel refreshes automatically.',
  },
  zh: {
    "workflowTitle": "本轮工作流",
    overviewTitle: '实时流程图',
    quickFlowTitle: '实时流程',
    quickFlowClose: '收起',
    overviewHint: '点击动作打开放大详情。',
    overviewEmpty: '等待第一步记录',
    overviewStart: '收到需求',
    overviewEnd: '本轮完成',
    overviewFailed: '本轮失败',
    overviewReason: '相关思考',
    overviewPurpose: '说明',
    stepDetails: '具体步骤',
    actionReasoning: '相关思考摘要',
    translationUnavailable: '本地思考翻译暂不可用。原文可在动作详情中查看。',
    'status.pending': '准备中',
    "workflowHint": "从上到下查看执行步骤，子动作列在所属动作下。",
    "requestStart": "收到需求",
    "jumpToLive": "定位当前步骤",
    "recordedThinking": "记录思考",
    "answerRecorded": "回答已记录",
    "thinkingExcerpt": "思考摘录",
    "originalThinking": "思考原文",
    "relatedThinking": "相关思考原文",
    "toolPurpose": "工具用途",
    "callDescription": "调用说明",
    "toolFallback": "调用工具",
    "answerDetails": "回答正文",
    "viewDetails": "查看详情",
    "requestDetails": "完整需求",
    "zoomTitle": "放大查看",
    "zoomClose": "关闭",
    "zoomHint": "流程图里被截断的文字，在这里完整显示。",
    "zoomLocate": "跳到页面位置",
    "zoomStep": "步骤详情",
    "toolErrors": "{n} 次工具失败",
    "subActions": "子动作",
    "resultMissing": "未记录结果",
    "status.unknown": "状态未知",
    tab: 'AI 思路',
    title: 'AI 思路透视镜',
    subtitle: '按轮次查看 AI 做了什么、相关思考和执行结果',
    liveBadge: '实时',
    idleBadge: '空闲',
    turnRailTitle: '对话轮次',
    railFoot: '点某一轮可以回看',
    turnN: '第 {n} 轮',
    currentTag: '当前',
    historyTag: '历史',
    backToCurrent: '回到当前轮',
    previousTurn: '上一轮思路',
    goalLabel: '你的需求',
    untitledTurn: '未命名轮次',
    metaSteps: '{n} 个步骤',
    metaTools: '{n} 次工具调用',
    metaDuration: '用时 {d}',
    elapsed: '已用 {d}',
    interrupted: '已中断',
    stepN: '步骤 {k}/{total}',
    stepNumber: '步骤 {k}',
    noSteps: '这一轮还没有记录到步骤。',
    argsLabel: '参数',
    resultLabel: '结果节选',
    errorLabel: '错误',
    'status.thinking': '思考中',
    'status.running': '进行中',
    'status.done': '完成',
    'status.failed': '失败',
    'status.error': '出错',
    'status.open': '进行中',
    'status.closed': '已完成',
    'activity.thinking': '正在思考',
    'activity.acting': '正在调用工具',
    'activity.answering': '正在输出回答',
    'activity.starting': '正在起步',
    'activity.done': '已完成',
    'activity.error': '出错',
    'note.context': '系统注入了上下文',
    'note.command': '执行了一个命令',
    'note.compaction': '上下文被压缩',
    'note.retry': '模型请求重试',
    'note.error': '这一轮出错了',
    'note.maxTokens': '达到输出长度上限',
    'note.unknown': '其他事件',
    'note.steering': '你插入了一条指令',
    countTimes: '{n} 项',
    turnCount: '{n} 轮对话',
    toolCount: '{n} 次工具',
    emptyTitle: '这里还没有对话轮次',
    emptyBody:
      '发起一轮对话后，这里会显示该轮的工作流。',
    liveHint: '这一轮还在进行中，面板会自动刷新。',
  },
};

const STYLE = `
.dsl-root{container-type:inline-size;display:flex;flex-direction:column;height:100%;min-height:0;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:14px;line-height:1.62;}
.dsl-header{flex:none;display:flex;align-items:center;gap:12px;padding:12px 20px 10px;border-bottom:1px solid var(--dsw-alias-border-l1);}
.dsl-logo{width:34px;height:34px;flex:none;display:block;}
.dsl-logo svg{width:100%;height:100%;display:block;}
.dsl-heading{flex:1;min-width:0;}
.dsl-h2{margin:0;font-size:15px;font-weight:600;}
.dsl-sub{margin:1px 0 0;font-size:12px;color:var(--dsw-alias-label-secondary);}
.dsl-header-stats{display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:flex-end;}
.dsl-chip{font-size:11.5px;padding:2px 9px;border-radius:999px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);border:1px solid var(--dsw-alias-border-l1);white-space:nowrap;}
.dsl-live-pill{display:inline-flex;align-items:center;gap:6px;font-size:12px;padding:3px 10px;border-radius:999px;border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);flex:none;}
.dsl-live-pill--on{color:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary);}
.dsl-live-pill-dot{width:7px;height:7px;border-radius:50%;background:var(--dsw-alias-state-idle-primary);flex:none;}
.dsl-live-pill--on .dsl-live-pill-dot{background:var(--dsw-alias-brand-primary);animation:dslPulse 1.4s ease-in-out infinite;}
@keyframes dslPulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.35;transform:scale(.78);}}
.dsl-body{flex:1;min-height:0;display:flex;}
.dsl-rail{width:212px;flex:none;border-right:1px solid var(--dsw-alias-border-l1);display:flex;flex-direction:column;min-height:0;background:var(--dsw-alias-bg-base);}
.dsl-rail-title{flex:none;padding:10px 14px 6px;font-size:11px;font-weight:600;letter-spacing:.4px;color:var(--dsw-alias-label-secondary);text-transform:uppercase;}
.dsl-rail-list{flex:1;min-height:0;overflow-y:auto;padding:2px 8px 10px;}
.dsl-turn-chip{display:flex;align-items:flex-start;gap:8px;width:100%;text-align:left;border:1px solid transparent;background:transparent;border-radius:9px;padding:8px 9px;margin-bottom:4px;cursor:pointer;font:inherit;color:inherit;transition:background .12s ease,border-color .12s ease;}
.dsl-turn-chip:hover{background:var(--dsw-alias-bg-layer-2);}
.dsl-turn-chip--active{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-border-l2);}
.dsl-turn-no{flex:none;width:22px;height:22px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:11.5px;font-weight:600;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);font-variant-numeric:tabular-nums;}
.dsl-turn-chip--active .dsl-turn-no{background:var(--dsw-alias-bg-layer-1);border-color:var(--dsw-alias-border-l2);}
.dsl-turn-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px;}
.dsl-turn-goal{font-size:12.5px;line-height:1.35;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;word-break:break-word;}
.dsl-turn-meta{font-size:10.5px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.dsl-turn-dot{flex:none;width:7px;height:7px;border-radius:50%;margin-top:7px;background:var(--dsw-alias-state-idle-primary);}
.dsl-turn-dot--live{background:var(--dsw-alias-brand-primary);animation:dslPulse 1.4s ease-in-out infinite;}
.dsl-turn-dot--error{background:var(--dsw-alias-state-error-primary);}
.dsl-rail-foot{flex:none;padding:8px 14px;border-top:1px solid var(--dsw-alias-border-l1);font-size:11px;color:var(--dsw-alias-label-secondary);}
.dsl-main-scroll{flex:1;min-width:0;min-height:0;overflow-y:auto;padding:16px 22px 48px;}
.dsl-turn-detail{max-width:900px;margin:0 auto;}
.dsl-turn-head{display:flex;flex-direction:column;gap:8px;padding-bottom:12px;border-bottom:1px solid var(--dsw-alias-border-l1);}
.dsl-turn-title-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.dsl-turn-badge{font-size:15px;font-weight:600;}
.dsl-status{font-size:11px;padding:1px 8px;border-radius:999px;border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-2);}
.dsl-status--live{color:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary);}
.dsl-status--error{color:var(--dsw-alias-state-error-primary);border-color:var(--dsw-alias-state-error-primary);}
.dsl-tag{font-size:11px;color:var(--dsw-alias-label-secondary);}
.dsl-btn{margin-left:auto;font:inherit;font-size:11.5px;padding:3px 10px;border-radius:999px;border:1px solid var(--dsw-alias-border-l1);background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;}
.dsl-btn:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);}
.dsl-btn + .dsl-btn{margin-left:6px;}
.dsl-prose p{margin:4px 0;}
.dsl-prose h4{margin:8px 0 3px;font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary);}
.dsl-prose ul,.dsl-prose ol{margin:4px 0;padding-left:20px;}
.dsl-prose li{margin:1px 0;}
.dsl-prose blockquote{margin:5px 0;padding-left:9px;border-left:2px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);}
.dsl-prose hr{border:none;border-top:1px solid var(--dsw-alias-border-l1);margin:8px 0;}
.dsl-inline-code,.dsl-code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;}
.dsl-inline-code{font-size:12px;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:4px;padding:0 4px;}
.dsl-code{margin:6px 0;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:8px 10px;font-size:11.5px;line-height:1.55;overflow-x:auto;max-height:300px;white-space:pre;}

.dsl-turn-meta{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.dsl-meta{font-size:11px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums;}
.dsl-flow-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:16px 0 2px;}
.dsl-flow-title{margin:0;font-size:16px;font-weight:650;}
.dsl-flow-hint{margin:0 0 12px;color:var(--dsw-alias-label-secondary);font-size:12px;}
.dsl-flow,.dsl-events,.dsl-child-list{list-style:none;margin:0;padding:0;}
.dsl-flow-step{position:relative;padding:0 0 13px 38px;scroll-margin-top:12px;}
.dsl-flow-step:focus{outline:0;}
.dsl-flow-step:focus-visible .dsl-flow-panel{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px;}
.dsl-flow-step:not(:last-child)::before{
  content:"";position:absolute;top:24px;bottom:0;left:12px;width:2px;background:var(--dsw-alias-border-l2);
}
.dsl-flow-step:not(:last-child)::after{
  content:"";position:absolute;bottom:3px;left:9px;width:6px;height:6px;
  border-right:2px solid var(--dsw-alias-border-l2);border-bottom:2px solid var(--dsw-alias-border-l2);transform:rotate(45deg);
}
.dsl-flow-marker{
  display:grid;place-items:center;position:absolute;top:10px;left:0;width:26px;height:26px;box-sizing:border-box;
  border:1px solid var(--dsw-alias-border-l2);border-radius:50%;background:var(--dsw-alias-bg-layer-2);
  color:var(--dsw-alias-label-secondary);font-size:11px;font-weight:650;font-variant-numeric:tabular-nums;
}
.dsl-flow-panel{border:1px solid var(--dsw-alias-border-l1);border-radius:11px;background:var(--dsw-alias-bg-layer-1);min-width:0;}
.dsl-flow-step--live .dsl-flow-marker,.dsl-flow-step--live .dsl-flow-panel{border-color:var(--dsw-alias-brand-primary);}
.dsl-flow-step--live .dsl-flow-marker{color:var(--dsw-alias-brand-primary);}
.dsl-flow-step--error .dsl-flow-marker,.dsl-flow-step--error .dsl-flow-panel{border-color:var(--dsw-alias-state-error-primary);}
.dsl-flow-step--error .dsl-flow-marker{color:var(--dsw-alias-state-error-primary);}
.dsl-flow-step-head,.dsl-flow-start{padding:8px 11px;}
.dsl-flow-step-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.dsl-flow-step-title{margin:0;font-size:13px;font-weight:650;}
.dsl-flow-step-head .dsl-status{margin-left:auto;}
.dsl-flow-request{margin:2px 0 0;color:var(--dsw-alias-label-secondary);font-size:12px;overflow-wrap:anywhere;}
.dsl-event{border-top:1px solid var(--dsw-alias-border-l1);padding:6px 10px;min-width:0;}
.dsl-event-main{display:flex;align-items:baseline;gap:5px 8px;flex-wrap:wrap;}
.dsl-event-icon{flex:none;align-self:center;}
.dsl-event-icon .dsl-icon{width:20px;height:20px;border-radius:6px;}
.dsl-event-icon .dsl-icon svg{width:12px;height:12px;}
.dsl-event-title{font-size:13px;font-weight:600;overflow-wrap:anywhere;}
.dsl-event-subject{color:var(--dsw-alias-label-secondary);font-size:12px;overflow-wrap:anywhere;min-width:0;}
.dsl-event-status{margin-left:auto;color:var(--dsw-alias-label-secondary);font-size:11px;white-space:nowrap;}
.dsl-event-status--running{color:var(--dsw-alias-brand-primary);font-weight:600;}
.dsl-event-status--pending{color:var(--dsw-alias-brand-primary);}
.dsl-event-status--error{color:var(--dsw-alias-state-error-primary);font-weight:600;}
.dsl-event-status--ok{color:var(--dsw-alias-state-success-primary);}
.dsl-event-context{display:flex;align-items:baseline;gap:4px;flex-wrap:wrap;margin:1px 0 0 24px;font-size:12px;}
.dsl-event-description{color:var(--dsw-alias-label-secondary);min-width:0;overflow-wrap:anywhere;}
.dsl-event-label{color:var(--dsw-alias-label-secondary);font-size:11px;font-weight:600;margin-right:5px;}
.dsl-action-reasoning{margin:2px 0 0 24px;font-size:12px;overflow-wrap:anywhere;}
.dsl-action-reasoning .dsl-event-label{color:var(--dsw-alias-brand-primary);}
.dsl-event-detail{margin:2px 0 0 auto;flex:none;}
.dsl-event-detail summary{cursor:pointer;color:var(--dsw-alias-label-secondary);font-size:11px;white-space:nowrap;}
.dsl-event-detail summary:hover{color:var(--dsw-alias-brand-primary);}
.dsl-event-detail[open]{flex:1 0 100%;min-width:0;}
.dsl-event-detail[open] summary{width:max-content;max-width:100%;}
.dsl-event-data{margin-top:5px;}
.dsl-event-data pre{
  margin:2px 0 0;padding:7px 9px;max-height:220px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;
  background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:7px;font-size:11.5px;
}
.dsl-event-data .dsl-original-text{font:inherit;font-size:12px;}
.dsl-child-actions{margin:5px 0 0 24px;border-left:2px solid var(--dsw-alias-border-l2);}
.dsl-child-label{padding:2px 8px;}
.dsl-empty-step{margin:0;padding:5px 11px 9px;}
@container (max-width: 520px){
  .dsl-header{padding:8px 12px;}
  .dsl-header-stats>.dsl-chip{display:none;}
  .dsl-flow-step{padding-left:32px;}
  .dsl-event-status{margin-left:0;}
  .dsl-event-context,.dsl-action-reasoning{margin-left:0;}
  .dsl-event-detail{margin-left:0;}
}
.dsl-empty{max-width:540px;margin:56px auto 0;text-align:center;color:var(--dsw-alias-label-secondary);}
.dsl-empty-icon{display:block;width:44px;height:44px;margin:0 auto 12px;}
.dsl-empty-icon svg{width:100%;height:100%;display:block;}
.dsl-empty-title{font-size:15px;font-weight:600;color:var(--dsw-alias-label-primary);margin:0 0 6px;}
.dsl-empty-body{font-size:13px;line-height:1.75;margin:0;}
.dsl-empty-steps{padding:14px;border:1px dashed var(--dsw-alias-border-l2);border-radius:9px;text-align:center;font-size:12px;color:var(--dsw-alias-label-secondary);}
.dsl-hint{margin-top:12px;font-size:11.5px;color:var(--dsw-alias-label-secondary);text-align:center;}
@container (max-width: 760px){
  .dsl-body{flex-direction:column;}
  .dsl-rail{width:auto;border-right:none;border-bottom:1px solid var(--dsw-alias-border-l1);max-height:148px;}
  .dsl-rail-list{display:flex;gap:6px;overflow-x:auto;overflow-y:hidden;padding:4px 10px 8px;}
  .dsl-turn-chip{width:190px;flex:none;margin-bottom:0;}
  .dsl-rail-foot{display:none;}
  .dsl-main-scroll{padding:12px 14px 40px;}
}
`;

/** Re-render when the locale switches. */
function useLocaleState() {
  const service = viewRuntime.locale;
  const subscribe = React.useCallback((callback) => service.subscribe(callback), [service]);
  const read = React.useCallback(() => service.getLocale(), [service]);
  return React.useSyncExternalStore(subscribe, read, read);
}

/** Wall clock used for live durations; only ticks while a turn is running. */
function useClock(enabled) {
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    if (!enabled) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [enabled]);
  React.useEffect(() => {
    if (!enabled) setNow(Date.now());
  }, [enabled]);
  return now;
}
function renderInline(text, keyPrefix) {
  const source = typeof text === 'string' ? text : '';
  const nodes = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let match;
  let index = 0;
  while ((match = pattern.exec(source)) !== null) {
    if (match.index > last) nodes.push(source.slice(last, match.index));
    const token = match[0];
    if (token.startsWith('**')) nodes.push(h('strong', { key: keyPrefix + '-b' + index }, token.slice(2, -2)));
    else nodes.push(h('code', { key: keyPrefix + '-c' + index, className: 'dsl-inline-code' }, token.slice(1, -1)));
    last = match.index + token.length;
    index += 1;
  }
  if (last < source.length) nodes.push(source.slice(last));
  return nodes;
}

function renderProse(source, keyPrefix) {
  const lines = String(source).split(/\r?\n/);
  const nodes = [];
  let list = null;
  let cursor = 0;
  const flush = () => {
    if (list === null) return;
    const children = list.items.map((entry, position) =>
      h(
        'li',
        { key: keyPrefix + '-li' + cursor + '-' + position },
        renderInline(entry, keyPrefix + '-li' + cursor + '-' + position),
      ),
    );
    nodes.push(h(list.type === 'ol' ? 'ol' : 'ul', { key: keyPrefix + '-list' + cursor }, children));
    cursor += 1;
    list = null;
  };
  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/, '');
    if (line.trim() === '') {
      flush();
      continue;
    }
    const heading = /^\s{0,3}#{1,6}\s+(.*)$/.exec(line);
    if (heading) {
      flush();
      nodes.push(h('h4', { key: keyPrefix + '-h' + cursor }, renderInline(heading[1], keyPrefix + '-h' + cursor)));
      cursor += 1;
      continue;
    }
    const bullet = /^\s{0,6}[-*+]\s+(.*)$/.exec(line);
    if (bullet) {
      if (list === null || list.type !== 'ul') {
        flush();
        list = { type: 'ul', items: [] };
      }
      list.items.push(bullet[1]);
      continue;
    }
    const ordered = /^\s{0,6}\d{1,2}[.)]\s+(.*)$/.exec(line);
    if (ordered) {
      if (list === null || list.type !== 'ol') {
        flush();
        list = { type: 'ol', items: [] };
      }
      list.items.push(ordered[1]);
      continue;
    }
    const quote = /^\s{0,6}>\s?(.*)$/.exec(line);
    if (quote) {
      flush();
      nodes.push(h('blockquote', { key: keyPrefix + '-q' + cursor }, renderInline(quote[1], keyPrefix + '-q' + cursor)));
      cursor += 1;
      continue;
    }
    if (/^\s{0,3}([-*_])\s*(\1\s*){2,}$/.test(line)) {
      flush();
      nodes.push(h('hr', { key: keyPrefix + '-hr' + cursor }));
      cursor += 1;
      continue;
    }
    flush();
    nodes.push(h('p', { key: keyPrefix + '-p' + cursor }, renderInline(line, keyPrefix + '-p' + cursor)));
    cursor += 1;
  }
  flush();
  return nodes;
}

function renderMarkdown(text) {
  const source = typeof text === 'string' ? text : '';
  const limited = source.length > 60000 ? source.slice(0, 60000) + '\n\n…' : source;
  const segments = limited.split('```');
  const nodes = [];
  segments.forEach((segment, index) => {
    if (index % 2 === 1) {
      const body = segment.replace(/^[^\n]*\n/, '').replace(/\n$/, '');
      nodes.push(h('pre', { key: 'code-' + index, className: 'dsl-code' }, h('code', null, body)));
    } else {
      nodes.push.apply(nodes, renderProse(segment, 's' + index));
    }
  });
  return h('div', { className: 'dsl-prose' }, nodes);
}


function Chip(props) {
  return h('span', { className: 'dsl-chip' }, props.children);
}

const FLOW_OVERVIEW_STYLE = `
.dsl-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0;}
.dsl-icon{display:inline-grid;place-items:center;flex:none;width:24px;height:24px;border-radius:7px;box-sizing:border-box;
  --dsl-hue:#6b7280;color:var(--dsl-hue);
  background:color-mix(in srgb,var(--dsl-hue) 12%,var(--dsw-alias-bg-base));
  box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--dsl-hue) 18%,transparent);}
.dsl-icon svg{width:14px;height:14px;display:block;}
.dsl-icon[data-category="read"],.dsl-icon[data-category="search"]{--dsl-hue:#2f6bf2;}
.dsl-icon[data-category="web"]{--dsl-hue:#0e9384;}
.dsl-icon[data-category="write"]{--dsl-hue:#c97a06;}
.dsl-icon[data-category="run"]{--dsl-hue:#7a5af0;}
.dsl-icon[data-category="collab"]{--dsl-hue:#d1437f;}
.dsl-icon[data-category="answer"],.dsl-icon[data-category="deliver"],.dsl-icon[data-category="finish"]{--dsl-hue:#12a150;}
.dsl-icon[data-category="reasoning"]{--dsl-hue:#7c8594;}
.dsl-icon[data-category="note"]{--dsl-hue:#e2711d;}
.dsl-icon[data-category="error"]{--dsl-hue:var(--dsw-alias-state-error-primary);}
.dsl-icon[data-category="start"]{--dsl-hue:var(--dsw-alias-label-secondary);}

.dsl-map{margin:14px 0 18px;padding:14px 16px 16px;border:1px solid var(--dsw-alias-border-l1);border-radius:14px;
  background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);min-width:0;}
.dsl-map--compact{margin:0;padding:0;border:0;background:transparent;}
.dsl-map-head{display:flex;align-items:baseline;gap:4px 10px;flex-wrap:wrap;margin-bottom:12px;}
.dsl-map-title{margin:0;font-size:14px;font-weight:650;letter-spacing:.01em;}
.dsl-map-progress{font-size:11.5px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums;}
.dsl-map-hint,.dsl-map-empty{font-size:11.5px;color:var(--dsw-alias-label-secondary);margin:0;}
.dsl-map-hint{margin-left:auto;}
.dsl-map-scroll{position:relative;overflow:auto;scrollbar-width:thin;
  scrollbar-color:color-mix(in srgb,var(--dsw-alias-label-secondary) 40%,transparent) transparent;}
.dsl-map-track,.dsl-map-items{list-style:none;margin:0;padding:0;}

/* Shared card */
.dsl-map-box{position:relative;display:grid;grid-template-columns:24px minmax(0,1fr);column-gap:10px;align-items:center;
  width:100%;min-width:0;box-sizing:border-box;padding:9px 11px;text-align:left;
  border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-base);
  font:inherit;font-size:12.5px;line-height:1.4;color:inherit;
  transition:border-color .15s ease,box-shadow .15s ease,background .15s ease;}
button.dsl-map-box{cursor:pointer;}
button.dsl-map-box:hover{border-color:var(--dsw-alias-border-l2);
  box-shadow:0 2px 10px color-mix(in srgb,var(--dsw-alias-label-primary) 7%,transparent);}
.dsl-map-box:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px;}
.dsl-map-box > .dsl-icon{align-self:start;margin-top:1px;}
.dsl-map-box--terminal > .dsl-icon{align-self:center;margin-top:0;}
.dsl-map-text{min-width:0;display:flex;flex-direction:column;gap:1px;}
.dsl-map-line{display:flex;align-items:baseline;gap:6px;min-width:0;}
.dsl-map-name{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:none;max-width:100%;}
.dsl-map-subject{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;color:var(--dsw-alias-label-secondary);}
.dsl-map-purpose{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;
  font-size:11.5px;color:var(--dsw-alias-label-secondary);overflow-wrap:anywhere;}
.dsl-map-status{align-self:flex-start;display:inline-flex;align-items:center;gap:5px;margin-top:4px;padding:1px 7px;border-radius:999px;
  font-size:10.5px;font-weight:600;color:var(--dsw-alias-brand-primary);
  background:color-mix(in srgb,var(--dsw-alias-brand-primary) 10%,transparent);}
.dsl-map-status::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor;}
.dsl-map-box--live .dsl-map-status::before{animation:dslPulse 1.4s ease-in-out infinite;}
.dsl-map-box--error .dsl-map-status{color:var(--dsw-alias-state-error-primary);
  background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 10%,transparent);}
.dsl-map-box--live{border-color:var(--dsw-alias-brand-primary);
  background:color-mix(in srgb,var(--dsw-alias-brand-primary) 5%,var(--dsw-alias-bg-base));
  box-shadow:0 0 0 3px color-mix(in srgb,var(--dsw-alias-brand-primary) 16%,transparent);}
.dsl-map-box--error{border-color:color-mix(in srgb,var(--dsw-alias-state-error-primary) 60%,var(--dsw-alias-border-l1));}
.dsl-map-box--terminal{display:inline-grid;grid-template-columns:22px auto;column-gap:8px;align-items:center;width:auto;padding:5px 12px 5px 6px;
  border-radius:999px;background:var(--dsw-alias-bg-base);}
.dsl-map-box--terminal .dsl-icon{width:22px;height:22px;border-radius:50%;}
.dsl-map-box--terminal .dsl-map-name{font-weight:600;font-size:12px;}
@keyframes dslPulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.35;transform:scale(.78);}}

/* Full view: one column per step, read left to right */
.dsl-map-scroll{padding:5px 6px 8px 4px;}
.dsl-map-track{display:flex;align-items:flex-start;gap:0;width:max-content;min-width:100%;box-sizing:border-box;padding-right:8px;}
.dsl-map-group{position:relative;display:flex;flex-direction:column;gap:6px;flex:none;width:200px;}
.dsl-map-group--terminal{width:auto;padding-top:22px;}
.dsl-map-group-label{height:16px;font-size:11px;font-weight:600;color:var(--dsw-alias-label-secondary);
  font-variant-numeric:tabular-nums;letter-spacing:.02em;}
.dsl-map-items{display:flex;flex-direction:column;gap:8px;}
.dsl-map-link{flex:none;align-self:flex-start;position:relative;width:34px;height:2px;margin-top:44px;
  background:var(--dsw-alias-border-l2);}
.dsl-map-link::after{content:"";position:absolute;right:0;top:-3px;width:6px;height:6px;
  border-top:2px solid var(--dsw-alias-border-l2);border-right:2px solid var(--dsw-alias-border-l2);
  transform:rotate(45deg);box-sizing:border-box;}
.dsl-map-link--pending{background:repeating-linear-gradient(90deg,var(--dsw-alias-border-l2) 0 4px,transparent 4px 8px);}

/* Compact popover: a vertical rail */
.dsl-map--compact .dsl-map-head{margin-bottom:10px;}
.dsl-map--compact .dsl-map-hint{display:none;}
.dsl-map--compact .dsl-map-scroll{max-height:min(380px,52vh);padding:2px 4px 4px 2px;}
.dsl-map--compact .dsl-map-track{display:block;width:auto;min-width:0;position:relative;}
.dsl-map--compact .dsl-map-track::before{content:"";position:absolute;left:23px;top:16px;bottom:16px;width:2px;
  border-radius:1px;background:var(--dsw-alias-border-l1);}
.dsl-map--compact .dsl-map-group{width:auto;gap:6px;padding:0 0 10px 0;}
.dsl-map--compact .dsl-map-group--terminal{padding:0 0 10px 6px;}
.dsl-map--compact .dsl-map-group:last-child{padding-bottom:0;}
.dsl-map--compact .dsl-map-group-label{height:auto;padding-left:46px;}
.dsl-map--compact .dsl-map-items{gap:6px;}
.dsl-map--compact .dsl-map-box:not(.dsl-map-box--terminal){position:relative;}
.dsl-map--compact .dsl-map-link{display:none;}
.dsl-map--compact .dsl-map-box--terminal{background:var(--dsw-alias-bg-base);}

.dsl-zoom-backdrop{position:fixed;inset:0;z-index:1200;display:flex;align-items:center;justify-content:center;
  padding:24px;background:color-mix(in srgb,var(--dsw-alias-bg-base) 68%,transparent);backdrop-filter:blur(3px);}
.dsl-zoom{box-sizing:border-box;width:min(980px,94vw);max-height:88vh;display:flex;flex-direction:column;
  border:1px solid var(--dsw-alias-border-l2);border-radius:14px;background:var(--dsw-alias-bg-base);
  color:var(--dsw-alias-label-primary);overflow:hidden;
  box-shadow:0 20px 60px color-mix(in srgb,var(--dsw-alias-label-primary) 18%,transparent);}
.dsl-zoom-head{flex:none;display:flex;align-items:flex-start;gap:12px;padding:14px 18px;
  border-bottom:1px solid var(--dsw-alias-border-l1);}
.dsl-zoom-titles{flex:1;min-width:0;}
.dsl-zoom-kicker{font-size:11.5px;color:var(--dsw-alias-label-secondary);}
.dsl-zoom-title{margin:2px 0 0;font-size:17px;font-weight:650;overflow-wrap:anywhere;}
.dsl-zoom-close{flex:none;}
.dsl-zoom-body{flex:1;min-height:0;overflow:auto;padding:14px 18px 22px;display:flex;flex-direction:column;gap:12px;}
.dsl-zoom-node{display:flex;align-items:flex-start;gap:11px;padding:12px 14px;border-radius:11px;
  border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);}
.dsl-zoom-node--live{border-color:var(--dsw-alias-brand-primary);}
.dsl-zoom-node--error{border-color:var(--dsw-alias-state-error-primary);}
.dsl-zoom-node-icon{flex:none;}
.dsl-zoom-node-icon .dsl-icon{width:34px;height:34px;border-radius:10px;}
.dsl-zoom-node-icon .dsl-icon svg{width:19px;height:19px;}
.dsl-zoom-node-main{flex:1;min-width:0;}
.dsl-zoom-node-title{font-size:16px;font-weight:650;overflow-wrap:anywhere;}
.dsl-zoom-node-subject{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12.5px;
  font-weight:400;color:var(--dsw-alias-label-secondary);margin-left:6px;word-break:break-all;}
.dsl-zoom-node-meta{margin-top:3px;font-size:12px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums;}
.dsl-zoom-note{margin:0;font-size:12px;color:var(--dsw-alias-label-secondary);}
.dsl-zoom-actions{display:flex;gap:8px;flex-wrap:wrap;}
.dsl-zoom-events{display:flex;flex-direction:column;gap:9px;margin:0;padding:0;list-style:none;}
.dsl-zoom-events .dsl-event{border:1px solid var(--dsw-alias-border-l1);border-radius:9px;
  padding:9px 11px;background:var(--dsw-alias-bg-layer-1);}
.dsl-zoom-events .dsl-event-title{font-size:13.5px;}
.dsl-zoom-events .dsl-event-detail{border-top:0;}
.dsl-zoom-events .dsl-original-text{max-height:none;}
.dsl-zoom-events .dsl-event-data pre{max-height:none;}
`;

function describeMapStep(step, t) {
  const note = step.items.find((item) => item.noteKind === 'error' || item.noteKind === 'retry');
  if (note) return { title: t('note.' + note.noteKind), category: 'note' };
  if (step.messageCount > 0) return { title: t(step.live ? 'activity.answering' : 'answerRecorded'), category: 'answer' };
  if (step.thinkCount > 0) return { title: t(step.live ? 'status.thinking' : 'recordedThinking'), category: 'reasoning' };
  const event = step.items[0];
  return { title: t(event ? 'note.' + event.noteKind : 'status.' + (step.live ? 'thinking' : 'unknown')), category: 'note' };
}

function flowNodes(turn, t, lang, actionContext) {
  const activeStep = turn.live ? turn.steps.findLast((step) => step.live || step.running || step.pending) : null;
  const activeAction = activeStep?.items.findLast((item) => item.kind === 'tool' && item.status === 'running')
    || activeStep?.items.findLast((item) => item.kind === 'tool' && item.status === 'pending');
  const activeKey = activeAction?.key || (activeStep ? 'step-' + activeStep.step : null);
  const nodes = [{ key: 'start', title: t('overviewStart'), category: 'start' }];
  const shownReasoning = new Set();
  for (const step of turn.steps) {
    const actions = step.items.filter((item) => item.kind === 'tool');
    for (const action of actions) {
      const description = actionContext?.descriptions.get(action.key);
      const reasoning = actionContext?.summaries.get(action.key);
      const { title, subject } = describeToolAction(action, lang, t, description);
      const distinctDescription = description && ![title, subject, title + subject].some((label) =>
        label.replace(/[\s\p{P}]/gu, '') === description.replace(/[\s\p{P}]/gu, ''),
      );
      const reason = reasoning && (!shownReasoning.has(reasoning) || action.key === activeKey) ? reasoning : '';
      const purpose = distinctDescription ? description : reason;
      if (purpose && !distinctDescription) shownReasoning.add(reasoning);
      nodes.push({
        key: action.key,
        actionKey: action.key,
        step: step.step,
        title,
        subject,
        category: action.category,
        purpose,
        purposeLabel: t(distinctDescription ? 'overviewPurpose' : 'overviewReason'),
        tone: action.status === 'error' ? 'error' : action.key === activeKey ? 'live' : '',
        status: action.status === 'error' || action.status === 'running' || action.status === 'pending'
          ? t(TOOL_STATUS[action.status])
          : '',
      });
    }
    if (!actions.length || (step === activeStep && !activeAction)) {
      nodes.push({
        key: 'step-' + step.step,
        step: step.step,
        tone: step.hasError ? 'error' : step === activeStep ? 'live' : '',
        ...(step === activeStep
          ? { title: t('activity.' + turn.activity), category: turn.activity === 'answering' ? 'answer' : 'reasoning' }
          : describeMapStep(step, t)),
      });
    }
  }
  if (turn.hasError || turn.status === 'closed') {
    nodes.push({ key: 'finish', category: 'finish', tone: turn.hasError ? 'error' : '', title: t(turn.hasError ? 'overviewFailed' : 'overviewEnd') });
  }
  return { nodes, activeKey };
}

const ICON_PATHS = {
  start: 'M6 4v16M6 4.5h10.5l-2.2 3.6 2.2 3.6H6',
  read: 'M7 3.5h7l4 4V20.5H7zM14 3.5v4h4M9.5 12h6M9.5 15.5h6',
  search: 'M10.5 4.5a6 6 0 1 1 0 12a6 6 0 0 1 0-12zM15 15l4.5 4.5',
  write: 'M4.5 19.5h4l10-10-4-4-10 10zM13 7l4 4',
  run: 'M3.5 5h17v14h-17zM7.5 9.5l3 2.5-3 2.5M12.5 14.8h4',
  web: 'M12 3.5a8.5 8.5 0 1 1 0 17a8.5 8.5 0 0 1 0-17zM3.5 12h17M12 3.5c2.3 2.4 3.5 5.2 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.2-3.5-8.5s1.2-6.1 3.5-8.5z',
  collab: 'M9 11a3.3 3.3 0 1 0 0-6.6a3.3 3.3 0 0 0 0 6.6zM3 19.5c.6-3.3 3-5.5 6-5.5s5.4 2.2 6 5.5M16 4.6a3.2 3.2 0 0 1 0 6.2M18 14.2c1.8.8 3 2.6 3.3 5.3',
  deliver: 'M12 3.5l7.5 4.2v8.6L12 20.5l-7.5-4.2V7.7zM4.5 7.7l7.5 4.2 7.5-4.2M12 11.9v8.6',
  reasoning: 'M12 4l1.8 4.7L18.5 10.5l-4.7 1.8L12 17l-1.8-4.7L5.5 10.5l4.7-1.8zM18 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z',
  answer: 'M4.5 5h15v10.5H9.5l-5 4zM8.5 9.2h7M8.5 12h4.5',
  note: 'M12 4l8.5 15h-17zM12 10v4M12 16.8v.2',
  finish: 'M12 3.5a8.5 8.5 0 1 1 0 17a8.5 8.5 0 0 1 0-17zM8.2 12.2l2.6 2.6 5-5.3',
  other: 'M12 8.8a3.2 3.2 0 1 1 0 6.4a3.2 3.2 0 0 1 0-6.4zM12 3.5v2.6M12 17.9v2.6M3.5 12h2.6M17.9 12h2.6M6 6l1.8 1.8M16.2 16.2L18 18M6 18l1.8-1.8M16.2 7.8L18 6',
};

/** Small tinted line icon; colour comes from the category, nothing else. */
function CategoryIcon({ category, error = false }) {
  const key = error ? 'note' : Object.hasOwn(ICON_PATHS, category) ? category : 'other';
  return h(
    'span',
    { className: 'dsl-icon', 'data-category': error ? 'error' : category, 'aria-hidden': true },
    h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
      h('path', { d: ICON_PATHS[key] })),
  );
}


/** Icon category for one recorded event in the detailed list. */
function eventCategory(item) {
  if (item.kind === 'tool') return item.category || 'other';
  if (item.kind === 'think') return 'reasoning';
  if (item.kind === 'message') return 'answer';
  return 'note';
}

/** The plugin mark: a lens over three connected flow nodes. */
function LensMark() {
  const id = 'dsl-lens-' + React.useId().replace(/[^\w-]/g, '');
  return h(
    'svg',
    { viewBox: '0 0 40 40', fill: 'none' },
    h('defs', null, h('linearGradient', { id, x1: 0, y1: 0, x2: 1, y2: 1 },
      h('stop', { offset: 0, stopColor: '#4d6bfe' }), h('stop', { offset: 1, stopColor: '#7a5af0' }))),
    h('rect', { x: 1, y: 1, width: 38, height: 38, rx: 11, fill: 'url(#' + id + ')' }),
    h('path', { d: 'M12.5 14.5h4.5M16.5 14.5l3.5 5.5M20 20h-4.5', stroke: '#fff', strokeOpacity: 0.55, strokeWidth: 1.6, strokeLinecap: 'round' }),
    h('circle', { cx: 12, cy: 14.5, r: 2.3, fill: '#fff' }),
    h('circle', { cx: 20.5, cy: 14.5, r: 2.3, fill: '#fff', fillOpacity: 0.85 }),
    h('circle', { cx: 14, cy: 21, r: 2.3, fill: '#fff', fillOpacity: 0.7 }),
    h('circle', { cx: 18, cy: 18, r: 9.5, stroke: '#fff', strokeWidth: 2.4 }),
    h('path', { d: 'M25 25l6 6', stroke: '#fff', strokeWidth: 2.8, strokeLinecap: 'round' }),
  );
}

/** Group consecutive nodes that belong to the same step. */
function groupFlowNodes(nodes) {
  const groups = [];
  for (const node of nodes) {
    const last = groups.at(-1);
    if (node.step != null && last && last.step === node.step) last.nodes.push(node);
    else groups.push({ key: 'g-' + node.key, step: node.step, nodes: [node] });
  }
  return groups;
}

function FlowOverview({ turn, t, lang, compact = false, visible = true, actionContext, onStep }) {
  const viewport = React.useRef(null);
  const activeCell = React.useRef(null);
  const { nodes: graph, activeKey } = flowNodes(turn, t, lang, actionContext);
  const groups = groupFlowNodes(graph);
  const actions = graph.filter((node) => node.actionKey).length;
  React.useEffect(() => {
    const element = viewport.current;
    const cell = activeCell.current;
    if (!visible || !element || !cell || typeof cell.getBoundingClientRect !== 'function') return;
    const outer = element.getBoundingClientRect();
    const inner = cell.getBoundingClientRect();
    if (inner.top < outer.top) element.scrollTop += inner.top - outer.top - 8;
    else if (inner.bottom > outer.bottom) element.scrollTop += inner.bottom - outer.bottom + 8;
    if (inner.left < outer.left) element.scrollLeft += inner.left - outer.left - 16;
    else if (inner.right > outer.right) element.scrollLeft += inner.right - outer.right + 16;
  }, [visible, activeKey]);
  const progress = [t('metaSteps', { n: turn.stepCount }), t('metaTools', { n: actions })].join(' · ');

  const renderBox = (node) => {
    const stepNumber = node.step == null ? '' : t('stepNumber', { k: node.step });
    const badge = [stepNumber, node.status].filter(Boolean).join(' · ');
    const actionable = onStep && node.step != null;
    const current = node.key === activeKey;
    const terminal = node.category === 'start' || node.category === 'finish';
    const purposePreview = lang === 'zh'
      ? clip(node.purpose?.replace(/^(?:让我(?:也|先)?|我(?:们)?(?:也|先)?(?:需要|应该))\s*/, ''), 60)
      : clip(node.purpose, 110);
    const classes = ['dsl-map-box'];
    if (node.tone) classes.push('dsl-map-box--' + node.tone);
    if (terminal) classes.push('dsl-map-box--terminal');
    return h(
      'li',
      { className: 'dsl-map-cell', key: node.key, ref: current ? activeCell : undefined },
      h(
        actionable ? 'button' : 'div',
        {
          className: classes.join(' '),
          'data-category': node.category,
          'aria-current': current ? 'step' : undefined,
          title: [badge, node.title, node.subject, node.purpose ? node.purposeLabel + ' · ' + node.purpose : ''].filter(Boolean).join(' · '),
          ...(actionable ? { type: 'button', onClick: () => onStep(node.step, node.actionKey) } : {}),
        },
        h(CategoryIcon, { category: node.category, error: node.tone === 'error' && !terminal }),
        h(
          'span',
          { className: 'dsl-map-text' },
          badge ? h('span', { className: 'dsl-map-no dsl-sr' }, badge) : null,
          h(
            'span',
            { className: 'dsl-map-line' },
            h('span', { className: 'dsl-map-name' }, node.title),
            node.subject ? h('span', { className: 'dsl-map-subject' }, node.subject) : null,
          ),
          node.purpose
            ? h('span', { className: 'dsl-map-purpose' }, h('span', { className: 'dsl-sr' }, node.purposeLabel + ' · '), purposePreview)
            : null,
          node.status ? h('span', { className: 'dsl-map-status', 'aria-hidden': true }, node.status) : null,
        ),
      ),
    );
  };

  const track = [];
  groups.forEach((group, index) => {
    const terminal = group.step == null;
    if (index > 0) {
      const pending = !!turn.live && index === groups.length - 1;
      track.push(h('li', { key: 'link-' + group.key, className: 'dsl-map-link' + (pending ? ' dsl-map-link--pending' : ''), 'aria-hidden': true }));
    }
    track.push(h(
      'li',
      { key: group.key, className: 'dsl-map-group' + (terminal ? ' dsl-map-group--terminal' : '') },
      terminal ? null : h('div', { className: 'dsl-map-group-label', 'aria-hidden': true }, t('stepNumber', { k: group.step })),
      h('ol', { className: 'dsl-map-items', role: 'list' }, group.nodes.map(renderBox)),
    ));
  });

  return h(
    'section',
    { className: 'dsl-map' + (compact ? ' dsl-map--compact' : ''), 'aria-label': t('overviewTitle') },
    h(
      'div',
      { className: 'dsl-map-head' },
      h(compact ? 'strong' : 'h3', { className: 'dsl-map-title' }, t('overviewTitle')),
      turn.steps.length ? h('span', { className: 'dsl-map-progress' }, progress) : null,
      onStep ? h('p', { className: 'dsl-map-hint' }, t('overviewHint')) : null,
    ),
    h('div', { className: 'dsl-map-scroll', ref: viewport }, h('ol', { className: 'dsl-map-track', role: 'list' }, track)),
    !turn.steps.length && turn.live ? h('p', { className: 'dsl-map-empty' }, t('overviewEmpty')) : null,
  );
}

/** Keep short recorded prose in the main view when it matches the UI language. */
function readableExcerpt(text, lang) {
  let inCode = false;
  for (const line of (typeof text === 'string' ? text : '').split(/\r?\n/)) {
    const clean = line.trim();
    if (/^(?:~~~|\x60{3})/.test(clean)) {
      inCode = !inCode;
      continue;
    }
    if (inCode || !clean || /^(?:[>{}\[\]]|\x60)/.test(clean)) continue;
    const han = (clean.match(/\p{Script=Han}/gu) || []).length;
    const latin = (clean.match(/[a-z]/gi) || []).length;
    const firstLetter = clean.match(/[a-z]|\p{Script=Han}/iu)?.[0] || '';
    if (lang === 'zh' ? han >= 3 && han >= latin && /\p{Script=Han}/u.test(firstLetter) : latin >= 5) {
      return clip(clean, 100);
    }
  }
  return '';
}

const translatedReasoning = new Map();
const pendingReasoning = new Map();
let translationQueue = Promise.resolve();

async function translateLocally(texts) {
  const response = await fetch('api/step-lens-translate', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ texts }),
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) return null;
  const reply = await response.json();
  return reply?.ok && Array.isArray(reply.value) && reply.value.length === texts.length ? reply.value : null;
}

function translateReasoningBatch(texts) {
  const missing = texts.filter((text) => !translatedReasoning.has(text) && !pendingReasoning.has(text));
  if (missing.length) {
    const task = translationQueue.then(() => translateLocally(missing)).catch(() => null);
    translationQueue = task;
    missing.forEach((text, index) => {
      pendingReasoning.set(text, task.then((values) => {
        pendingReasoning.delete(text);
        const value = values?.[index];
        if (typeof value !== 'string' || !/\p{Script=Han}/u.test(value)) return '';
        if (translatedReasoning.size >= 512) translatedReasoning.delete(translatedReasoning.keys().next().value);
        const summary = value.trim()
          .replace(/构建(?:的)?新鲜度/g, '构建产物是否最新')
          .replace(/翻译[- ]?运行时间/g, '翻译运行环境')
          .replace(/离线翻译人员/g, '离线翻译');
        translatedReasoning.set(text, summary);
        return summary;
      }));
    });
  }
  return Promise.all(texts.map((text) => translatedReasoning.get(text) || pendingReasoning.get(text)));
}

function useActionReasoning(turn, lang, enabled = true) {
  const sources = React.useMemo(() => {
    const entries = new Map();
    if (!enabled || !turn) return entries;
    const collect = (item) => {
      if (item.kind !== 'tool') return;
      const englishReasoning = lang === 'zh' ? selectReasoningExcerpt(item.priorReasoning, item) : '';
      const reasoning = englishReasoning || readableExcerpt(item.priorReasoning, lang);
      const localDescription = readableExcerpt(item.description, lang);
      const englishDescription = lang === 'zh' && !localDescription && readableExcerpt(item.description, 'en')
        ? firstLine(item.description, 240)
        : '';
      const description = localDescription || englishDescription;
      if (reasoning || description) {
        entries.set(item.key, {
          reasoning: { text: reasoning, translate: !!englishReasoning },
          description: { text: description, translate: !!englishDescription },
        });
      }
      for (const child of item.children || EMPTY_LIST) collect(child);
    };
    for (const step of turn.steps) for (const item of step.items) collect(item);
    return entries;
  }, [turn, lang, enabled]);
  const englishTexts = [...new Set([...sources.values()].flatMap((entry) =>
    [entry.description, entry.reasoning].filter((source) => source.translate).map((source) => source.text),
  ))];
  // A new stream chunk can rebuild the turn even when its completed call excerpts are identical.
  const sourceKey = JSON.stringify(turn?.live ? englishTexts.reverse() : englishTexts);
  const [unavailable, setUnavailable] = React.useState(false);
  const [, refresh] = React.useState(0);
  React.useEffect(() => {
    const missing = JSON.parse(sourceKey).filter((text) => !translatedReasoning.has(text));
    if (!missing.length) return undefined;
    let current = true;
    async function translateTurn() {
      for (let index = 0; current && index < missing.length; index += 8) {
        const values = await translateReasoningBatch(missing.slice(index, index + 8));
        if (!current) return;
        if (!values.some(Boolean)) {
          setUnavailable(true);
          return;
        }
        setUnavailable(false);
        refresh((version) => version + 1);
      }
    }
    void translateTurn();
    return () => { current = false; };
  }, [sourceKey]);
  const summaries = new Map();
  const descriptions = new Map();
  for (const [key, { reasoning, description }] of sources) {
    const thought = reasoning.translate ? translatedReasoning.get(reasoning.text) : reasoning.text;
    const explanation = description.translate ? translatedReasoning.get(description.text) : description.text;
    if (thought) summaries.set(key, thought);
    if (explanation) descriptions.set(key, explanation);
  }
  return { summaries, descriptions, unavailable: unavailable && englishTexts.length > 0 };
}

function describeToolAction(item, lang, t, description) {
  const concrete = describeRecordedAction(item, lang);
  if (concrete) return concrete;
  const args = item.args || {};
  if (typeof args.command === 'string' && description) return { title: description, subject: '' };
  const path = [args.file_path, args.path, args.cd].find((value) => typeof value === 'string' && value);
  const known = item.title && item.title !== item.name;
  const subject = path
    ? clip(basename(path), 65)
    : typeof args.command === 'string' || item.subject === item.description
      ? ''
      : clip(item.subject, 70);
  return { title: known ? item.title : t('toolFallback'), subject: subject || (!known ? item.name : '') };
}

const TOOL_STATUS = {
  ok: 'status.done',
  running: 'status.running',
  pending: 'status.pending',
  error: 'status.failed',
  interrupted: 'interrupted',
  unknown: 'resultMissing',
};

function DetailField({ label, value, prose = false, markdown = false }) {
  if (!value) return null;
  return h(
    'div',
    { className: 'dsl-event-data' },
    h('span', { className: 'dsl-event-label' }, label),
    markdown ? renderMarkdown(value) : h('pre', { className: prose ? 'dsl-original-text' : undefined }, value),
  );
}

function NodeDetails({ t, label, children, open }) {
  return h(
    'details',
    { className: 'dsl-event-detail', ...(open ? { open: true } : {}) },
    h('summary', null, label || t('viewDetails')),
    children,
  );
}

function EventNode({ item, t, lang, actionContext, registerAction, expanded = false, zoom = false }) {
  const tool = item.kind === 'tool';
  const thinking = item.kind === 'think';
  const message = item.kind === 'message';
  const recordedText = thinking ? item.text : tool ? item.priorReasoning : '';
  const excerpt = thinking ? readableExcerpt(recordedText, lang) : '';
  const actionReason = tool ? actionContext.summaries.get(item.key) : '';
  const description = tool ? actionContext.descriptions.get(item.key) : '';
  const tone = tool
    ? item.status
    : item.streaming
      ? 'running'
      : item.tone === 'error'
        ? 'error'
        : '';
  const action = tool ? describeToolAction(item, lang, t, description) : null;
  const title = tool
    ? action.title
    : thinking
      ? t(item.streaming ? 'status.thinking' : 'recordedThinking')
      : message
        ? t(item.streaming ? 'activity.answering' : 'answerRecorded')
        : t('note.' + item.noteKind);
  const statusText = tool
    ? t(TOOL_STATUS[item.status] || 'status.unknown')
    : item.interrupted
      ? t('interrupted')
      : item.count != null
        ? t('countTimes', { n: item.count })
        : '';
  const duration = tool && item.duration != null ? formatDuration(item.duration, lang) : '';
  const visibleDescription = description === action?.title ? '' : description;
  const purpose = tool && !description ? item.what : '';
  const canExpand = tool
    ? !!(item.description || item.argsText || item.result || item.error || recordedText)
    : !!(item.text || item.detail);
  return h(
    'li',
    {
      className: 'dsl-event' + (zoom ? ' dsl-event--zoom' : ''),
      'data-kind': item.kind,
      'data-status': tone || undefined,
      ...(tool && typeof registerAction === 'function' ? { ref: (node) => registerAction(item.key, node), tabIndex: -1 } : {}),
    },
    h(
      'div',
      { className: 'dsl-event-main' },
      h('span', { className: 'dsl-event-icon', 'aria-hidden': true }, h(CategoryIcon, { category: eventCategory(item), error: tone === 'error' })),
      h('span', { className: 'dsl-event-title' }, title),
      action?.subject ? h('span', { className: 'dsl-event-subject' }, action.subject) : null,
      statusText
        ? h('span', { className: 'dsl-event-status' + (tone ? ' dsl-event-status--' + tone : '') }, statusText, duration ? ' · ' + duration : '')
        : null,
    ),
    actionReason
      ? h(
          'p',
          { className: 'dsl-action-reasoning' },
          h('span', { className: 'dsl-event-label' }, t('actionReasoning')),
          actionReason,
        )
      : null,
    purpose || visibleDescription || excerpt || canExpand
      ? h(
          'div',
          { className: 'dsl-event-context' },
          visibleDescription || purpose
            ? h(
                'span',
                { className: 'dsl-event-description' },
                h('span', { className: 'dsl-event-label' }, t(visibleDescription ? 'callDescription' : 'toolPurpose')),
                visibleDescription || purpose,
              )
            : excerpt
              ? h(
                  'span',
                  { className: 'dsl-event-description' },
                  h('span', { className: 'dsl-event-label' }, t('thinkingExcerpt')),
                  excerpt,
                )
              : null,
          canExpand
            ? h(
                NodeDetails,
                { t, open: expanded },
                tool && description !== item.description ? h(DetailField, { label: t('callDescription'), value: item.description, prose: true }) : null,
                recordedText ? h(DetailField, { label: t(tool ? 'relatedThinking' : 'originalThinking'), value: recordedText, prose: true }) : null,
                tool ? h(DetailField, { label: t('argsLabel'), value: item.argsText }) : null,
                tool ? h(DetailField, { label: t('resultLabel'), value: clip(item.result, zoom ? 20000 : 4000) }) : null,
                tool ? h(DetailField, { label: t('errorLabel'), value: item.error }) : null,
                message ? h(DetailField, { label: t('answerDetails'), value: item.text, markdown: true }) : null,
                !tool && !thinking && !message
                  ? h(DetailField, { label: title, value: [item.text, item.detail].filter(Boolean).join('\n\n'), prose: true })
                  : null,
              )
            : null,
        )
      : null,
    tool && item.children?.length
      ? h(
          'div',
          { className: 'dsl-child-actions' },
          h('div', { className: 'dsl-meta dsl-child-label' }, t('subActions')),
          h('ol', { className: 'dsl-child-list', role: 'list' }, item.children.map((child) =>
            h(EventNode, { key: child.key, item: child, t, lang, actionContext, registerAction, expanded, zoom }),
          )),
        )
      : null,
  );
}

function findZoomItem(items, key) {
  for (const item of items) {
    if (item.key === key) return item;
    if (item.children && item.children.length) {
      const found = findZoomItem(item.children, key);
      if (found) return found;
    }
  }
  return null;
}

/** Title used by the zoom dialog for one flow node. */
function zoomTargetTitle(turn, step, actionKey, t, lang, actionContext) {
  const item = actionKey ? findZoomItem(step.items, actionKey) : null;
  if (!item) return t('stepN', { k: step.step, total: turn.stepCount });
  const description = actionContext && actionContext.descriptions ? actionContext.descriptions.get(item.key) : '';
  return describeToolAction(item, lang, t, description).title;
}

/**
 * Full, unscaled detail for one flow node: a large node header plus the
 * complete event list with every collapsible section already open.
 */
function ZoomContent(props) {
  const { turn, step, actionKey, t, lang, actionContext, onLocate } = props;
  if (!step) return null;
  const item = actionKey ? findZoomItem(step.items, actionKey) : null;
  const action = item ? describeToolAction(item, lang, t, actionContext.descriptions.get(item.key)) : null;
  const events = item ? [item] : step.items;
  const tone = item
    ? item.status === 'error'
      ? 'error'
      : item.status === 'running' || item.status === 'pending'
        ? 'live'
        : ''
    : step.hasError
      ? 'error'
      : step.live || step.running || step.pending
        ? 'live'
        : '';
  const metaParts = [];
  if (item) {
    metaParts.push(t(TOOL_STATUS[item.status] || 'status.unknown'));
    if (item.duration != null) metaParts.push(formatDuration(item.duration, lang));
    if (item.subCalls) metaParts.push(t('subCalls', { n: item.subCalls }));
  } else {
    if (step.toolCount) metaParts.push(t('metaTools', { n: step.toolCount }));
    const duration =
      step.startTime != null && step.endTime != null ? Math.max(0, step.endTime - step.startTime) : null;
    if (duration != null) metaParts.push(formatDuration(duration, lang));
    if (step.hasError) metaParts.push(t('status.failed'));
  }
  return h(
    'div',
    { className: 'dsl-zoom-content' },
    h(
      'div',
      { className: 'dsl-zoom-node' + (tone ? ' dsl-zoom-node--' + tone : '') },
      h('span', { className: 'dsl-zoom-node-icon', 'aria-hidden': true }, h(CategoryIcon, { category: item ? eventCategory(item) : 'reasoning', error: tone === 'error' })),
      h(
        'div',
        { className: 'dsl-zoom-node-main' },
        h(
          'div',
          { className: 'dsl-zoom-node-title' },
          item ? action.title : t('stepN', { k: step.step, total: turn.stepCount }),
          item && action.subject ? h('code', { className: 'dsl-zoom-node-subject' }, action.subject) : null,
        ),
        metaParts.length ? h('div', { className: 'dsl-zoom-node-meta' }, metaParts.join(' · ')) : null,
      ),
    ),
    h('p', { className: 'dsl-zoom-note' }, t('zoomHint')),
    onLocate
      ? h(
          'div',
          { className: 'dsl-zoom-actions' },
          h('button', { type: 'button', className: 'dsl-btn', onClick: onLocate }, t('zoomLocate')),
        )
      : null,
    events.length
      ? h(
          'ol',
          { className: 'dsl-zoom-events', role: 'list' },
          events.map((entry) =>
            h(EventNode, { key: entry.key, item: entry, t, lang, actionContext, expanded: true, zoom: true }),
          ),
        )
      : h('p', { className: 'dsl-zoom-note' }, t('noSteps')),
  );
}

/** Large modal frame for one flow node; closes on backdrop click and Escape. */
function ZoomDialog(props) {
  const { t, kicker, title, onClose, children } = props;
  React.useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return h(
    'div',
    { className: 'dsl-zoom-backdrop', onClick: onClose, role: 'presentation' },
    h(
      'div',
      {
        className: 'dsl-zoom',
        role: 'dialog',
        'aria-modal': 'true',
        'aria-label': title || kicker || t('zoomTitle'),
        onClick: (event) => event.stopPropagation(),
      },
      h(
        'div',
        { className: 'dsl-zoom-head' },
        h(
          'div',
          { className: 'dsl-zoom-titles' },
          kicker ? h('div', { className: 'dsl-zoom-kicker' }, kicker) : null,
          h('h3', { className: 'dsl-zoom-title' }, title || t('zoomTitle')),
        ),
        h('button', { type: 'button', className: 'dsl-btn dsl-zoom-close', onClick: onClose, autoFocus: true }, t('zoomClose')),
      ),
      h('div', { className: 'dsl-zoom-body' }, children),
    ),
  );
}

function FlowStep({ t, lang, turn, step, now, active, nodeRef, actionContext, registerAction }) {
  const isLive = turn.live && (step.live || step.running || step.pending);
  const duration = step.startTime == null
    ? null
    : step.endTime != null
      ? Math.max(0, step.endTime - step.startTime)
      : isLive
        ? Math.max(0, now - step.startTime)
        : null;
  const errorCount = step.toolErrorCount || 0;
  const tone = step.hasError ? 'error' : isLive ? 'live' : '';
  const status = step.hasError
    ? 'status.failed'
    : isLive
      ? 'status.running'
      : step.status === 'closed'
        ? 'status.done'
        : 'status.unknown';
  return h(
    'li',
    {
      className: 'dsl-flow-step' + (tone ? ' dsl-flow-step--' + tone : ''),
      ref: nodeRef,
      tabIndex: -1,
      'aria-current': active ? 'step' : undefined,
    },
    h('span', { className: 'dsl-flow-marker', 'aria-hidden': true }, step.step),
    h(
      'section',
      { className: 'dsl-flow-panel' },
      h(
        'div',
        { className: 'dsl-flow-step-head' },
        h('h4', { className: 'dsl-flow-step-title' }, t(step.step > turn.stepCount ? 'stepNumber' : 'stepN', { k: step.step, total: turn.stepCount })),
        step.toolCount > 0 ? h('span', { className: 'dsl-meta' }, t('metaTools', { n: step.toolCount })) : null,
        errorCount > 0 ? h('span', { className: 'dsl-event-status--error dsl-meta' }, t('toolErrors', { n: errorCount })) : null,
        duration != null ? h('span', { className: 'dsl-meta' }, formatDuration(duration, lang)) : null,
        h('span', { className: 'dsl-status' + (tone ? ' dsl-status--' + tone : '') }, t(status)),
      ),
      step.items.length
        ? h('ol', { className: 'dsl-events', role: 'list' }, step.items.map((item) => h(EventNode, { key: item.key, item, t, lang, actionContext, registerAction })))
        : h('p', { className: 'dsl-meta dsl-empty-step' }, t(isLive ? 'status.thinking' : 'noSteps')),
    ),
  );
}

function TurnDetail({ t, lang, turn, isLatest, live, now, previousTurn, onBackToCurrent, onOpenTurn }) {
  const stepRefs = React.useRef(new Map());
  const actionRefs = React.useRef(new Map());
  const actionContext = useActionReasoning(turn, lang);
  const [zoomTarget, setZoomTarget] = React.useState(null);
  const registerAction = (key, node) => {
    if (node) actionRefs.current.set(key, node);
    else actionRefs.current.delete(key);
  };
  const currentStep = live ? turn.steps.findLast((step) => step.live || step.running || step.pending) : null;
  const jumpToStep = (step, key) => {
    const node = actionRefs.current.get(key) || stepRefs.current.get(step);
    if (!node) return;
    node.focus({ preventScroll: true });
    node.scrollIntoView({ block: 'start' });
  };
  const status = turn.hasError
    ? 'status.error'
    : live
      ? 'activity.' + turn.activity
      : turn.status === 'closed'
        ? 'status.closed'
        : 'status.unknown';
  const statusClass = turn.hasError ? ' dsl-status--error' : live ? ' dsl-status--live' : '';
  const duration = turn.durationMs ?? (turn.startTime != null && live ? Math.max(0, now - turn.startTime) : null);
  const request = firstLine(turn.goal, 100);
  const zoomStep = zoomTarget ? turn.steps.find((entry) => entry.step === zoomTarget.step) : null;
  const zoomDialog =
    zoomTarget && zoomStep
      ? h(
          ZoomDialog,
          {
            t,
            kicker: [t('turnN', { n: turn.turn }), t('stepN', { k: zoomStep.step, total: turn.stepCount })].join(' · '),
            title: zoomTargetTitle(turn, zoomStep, zoomTarget.actionKey, t, lang, actionContext),
            onClose: () => setZoomTarget(null),
          },
          h(ZoomContent, {
            turn,
            step: zoomStep,
            actionKey: zoomTarget.actionKey,
            t,
            lang,
            actionContext,
            onLocate: () => {
              const target = zoomTarget;
              setZoomTarget(null);
              setTimeout(() => jumpToStep(target.step, target.actionKey), 0);
            },
          }),
        )
      : null;
  return h(
    'div',
    { className: 'dsl-turn-detail' },
    h(
      'div',
      { className: 'dsl-turn-head' },
      h(
        'div',
        { className: 'dsl-turn-title-row' },
        h('span', { className: 'dsl-turn-badge' }, t('turnN', { n: turn.turn })),
        h('span', { className: 'dsl-status' + statusClass }, t(status)),
        h('span', { className: 'dsl-tag' }, isLatest ? t('currentTag') : t('historyTag')),
        !isLatest ? h('button', { type: 'button', className: 'dsl-btn', onClick: onBackToCurrent }, t('backToCurrent')) : null,
        isLatest && previousTurn ? h('button', { type: 'button', className: 'dsl-btn', onClick: () => onOpenTurn(previousTurn.turn) }, t('previousTurn')) : null,
      ),
      h(
        'div',
        { className: 'dsl-turn-meta' },
        h(Chip, null, t('metaSteps', { n: turn.stepCount })),
        h(Chip, null, t('metaTools', { n: turn.toolCount })),
        duration != null ? h(Chip, null, t(live ? 'elapsed' : 'metaDuration', { d: formatClock(duration, lang) })) : null,
        turn.toolErrorCount > 0 ? h(Chip, null, t('toolErrors', { n: turn.toolErrorCount })) : null,
      ),
    ),
    h(FlowOverview, { turn, t, lang, actionContext, onStep: (stepNumber, actionKey) => setZoomTarget({ step: stepNumber, actionKey }) }),
    h(
      'div',
      { className: 'dsl-flow-head' },
      h('h3', { className: 'dsl-flow-title' }, t('stepDetails')),
      currentStep
        ? h(
            'button',
            { type: 'button', className: 'dsl-btn', onClick: () => jumpToStep(currentStep.step) },
            t('jumpToLive'),
          )
        : null,
    ),
    h('p', { className: 'dsl-flow-hint' }, t('workflowHint')),
    actionContext.unavailable ? h('p', { className: 'dsl-flow-hint', role: 'status' }, t('translationUnavailable')) : null,
    h(
      'ol',
      { className: 'dsl-flow', role: 'list', 'aria-label': t('workflowTitle') },
      request
        ? h(
            'li',
            { className: 'dsl-flow-step' },
            h('span', { className: 'dsl-flow-marker', 'aria-hidden': true }, '↓'),
            h(
              'div',
              { className: 'dsl-flow-panel dsl-flow-start' },
              h('div', { className: 'dsl-flow-step-title' }, t('requestStart')),
              h('p', { className: 'dsl-flow-request' }, request),
              request !== turn.goal
                ? h(NodeDetails, { t, label: t('requestDetails') }, h(DetailField, { label: t('goalLabel'), value: turn.goal, prose: true }))
                : null,
            ),
          )
        : null,
      turn.steps.map((step) =>
        h(FlowStep, {
          key: step.step,
          t, lang, turn, step, now, actionContext, registerAction,
          active: step === currentStep,
          nodeRef: (node) => {
            if (node) stepRefs.current.set(step.step, node);
            else stepRefs.current.delete(step.step);
          },
        }),
      ),
    ),
    turn.steps.length === 0 ? h('div', { className: 'dsl-empty-steps' }, t('noSteps')) : null,
    live ? h('div', { className: 'dsl-hint' }, t('liveHint')) : null,
    zoomDialog,
  );
}

function TurnChip(props) {
  const { t, lang, turn, active, now, onClick } = props;
  const duration =
    turn.durationMs != null ? turn.durationMs : turn.startTime != null && turn.live ? Math.max(0, now - turn.startTime) : null;
  const metaParts = [t('metaTools', { n: turn.toolCount })];
  if (duration != null) metaParts.push(formatClock(duration, lang));
  return h(
    'button',
    {
      type: 'button',
      className: 'dsl-turn-chip' + (active ? ' dsl-turn-chip--active' : ''),
      onClick,
      'aria-current': active ? 'true' : 'false',
    },
    h('span', { className: 'dsl-turn-no' }, String(turn.turn)),
    h(
      'span',
      { className: 'dsl-turn-body' },
      h('span', { className: 'dsl-turn-goal' }, turn.goal ? clip(turn.goal, 80) : t('untitledTurn')),
      h('span', { className: 'dsl-turn-meta' }, metaParts.join(' · ')),
    ),
    h(
      'span',
      {
        className:
          'dsl-turn-dot' +
          (turn.hasError ? ' dsl-turn-dot--error' : turn.live ? ' dsl-turn-dot--live' : ''),
      },
    ),
  );
}

function EmptyState(props) {
  return h(
    'div',
    { className: 'dsl-empty' },
    h('span', { className: 'dsl-empty-icon', 'aria-hidden': true }, h(LensMark)),
    h('p', { className: 'dsl-empty-title' }, props.t('emptyTitle')),
    h('p', { className: 'dsl-empty-body' }, props.t('emptyBody')),
  );
}

function useLensLocale(props) {
  const input = props || {};
  const localeSnapshot = useLocaleState();
  const activeLocale = localeSnapshot && localeSnapshot.active ? String(localeSnapshot.active) : 'en';
  const lang = activeLocale.toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en';
  const boundT = viewRuntime.locale ? viewRuntime.locale.bind(NS) : null;
  const t = typeof input.t === 'function' ? input.t : boundT || ((key) => (STRINGS[lang] && STRINGS[lang][key]) || key);
  return { lang, t };
}

function useLensModel(useChat, lang) {
  const snapshot = typeof useChat === 'function' ? useChat((state) => state) : null;
  const legacy = snapshot && snapshot.legacy ? snapshot.legacy : null;
  const nodes = legacy && Array.isArray(legacy.nodes) ? legacy.nodes : EMPTY_LIST;
  const runningCalls = legacy && Array.isArray(legacy.runningCalls) ? legacy.runningCalls : EMPTY_LIST;
  const partial = legacy && legacy.partial ? legacy.partial : null;
  const timeline = snapshot && snapshot.timeline ? snapshot.timeline : null;

  return React.useMemo(
    () => buildTurnModel({ nodes, runningCalls, partial, timeline, guide: GUIDE, lang }),
    [nodes, runningCalls, partial, timeline, lang],
  );
}

function StepLensView(props) {
  const { lang, t } = useLensLocale(props);
  const { turns } = useLensModel(props?.useChat, lang);
  const latestTurn = turns.length > 0 ? turns[turns.length - 1].turn : null;
  const [pinnedTurn, setPinnedTurn] = React.useState(null);
  const activeTurn =
    pinnedTurn !== null && turns.some((turn) => turn.turn === pinnedTurn) ? pinnedTurn : latestTurn;
  const selected = turns.find((turn) => turn.turn === activeTurn) || null;
  const isLatest = activeTurn !== null && activeTurn === latestTurn;
  const live = !!(selected && selected.isCurrent && selected.live);
  const sessionLive = turns.length > 0 ? turns[turns.length - 1].live === true : false;
  const now = useClock(live || sessionLive);
  const previousTurn = turns.length >= 2 ? turns[turns.length - 2] : null;

  const scrollRef = React.useRef(null);
  React.useEffect(() => {
    const element = scrollRef.current;
    if (element) element.scrollTop = 0;
  }, [activeTurn]);

  const totalTools = turns.reduce((sum, turn) => sum + turn.toolCount, 0);

  return h(
    'div',
    { className: 'dsl-root' },
    h('style', null, STYLE),
    h('style', null, FLOW_OVERVIEW_STYLE),
    h(
      'div',
      { className: 'dsl-header' },
      h('span', { className: 'dsl-logo', 'aria-hidden': true }, h(LensMark)),
      h(
        'div',
        { className: 'dsl-heading' },
        h('h2', { className: 'dsl-h2' }, t('title')),
        h('p', { className: 'dsl-sub' }, t('subtitle')),
      ),
      h(
        'div',
        { className: 'dsl-header-stats' },
        h('span', { className: 'dsl-chip' }, t('turnCount', { n: turns.length })),
        h('span', { className: 'dsl-chip' }, t('toolCount', { n: totalTools })),
        h(
          'span',
          { className: 'dsl-live-pill' + (sessionLive ? ' dsl-live-pill--on' : '') },
          h('span', { className: 'dsl-live-pill-dot' }),
          sessionLive ? t('liveBadge') : t('idleBadge'),
        ),
      ),
    ),
    h(
      'div',
      { className: 'dsl-body' },
      h(
        'div',
        { className: 'dsl-rail' },
        h('div', { className: 'dsl-rail-title' }, t('turnRailTitle')),
        h(
          'div',
          { className: 'dsl-rail-list' },
          turns.map((turn) =>
            h(TurnChip, {
              key: turn.turn,
              t,
              lang,
              turn,
              now,
              active: turn.turn === activeTurn,
              onClick: () => setPinnedTurn(turn.turn === latestTurn ? null : turn.turn),
            }),
          ),
        ),
        h('div', { className: 'dsl-rail-foot' }, t('railFoot')),
      ),
      h(
        'div',
        { className: 'dsl-main-scroll', ref: scrollRef },
        turns.length === 0
          ? h(EmptyState, { t })
          : selected
            ? h(TurnDetail, {
                key: selected.turn,
                t,
                lang,
                turn: selected,
                isLatest,
                live,
                now,
                previousTurn: isLatest ? previousTurn : null,
                onBackToCurrent: () => setPinnedTurn(null),
                onOpenTurn: (turn) => setPinnedTurn(turn),
              })
            : null,
      ),
    ),
  );
}

/** Client plugin body: register dictionaries and the conversation View tab. */
function installClientPlugin(ctx) {
  viewRuntime.locale = ctx.locale;
  ctx.effect(() => ctx.locale.register(NS, 'en', STRINGS.en));
  ctx.effect(() => ctx.locale.register(NS, 'zh', STRINGS.zh));
  const t = ctx.locale.bind(NS);
  registerQuickFlow(ctx);
  ctx.slots.inject('conversation.view', () =>
    ctx.slots.register(
      {
        name: 'conversation.view',
        id: 'step-lens',
        order: 20,
        label: () => t('tab'),
      },
      StepLensView,
    ),
  );
}




// A dismissed live round stays dismissed even when its header is remounted.
const quickFlowOpenedTurns = new Map();

const QUICK_FLOW_STYLE = `
.dsl-quick-flow {
  flex: none;
  color: var(--dsw-alias-label-primary);
}
.dsl-quick-flow-trigger,
.dsl-quick-flow-close {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 7px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 7px;
  background: var(--dsw-alias-bg-layer-1);
  color: inherit;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;
}
.dsl-quick-flow-trigger:hover,
.dsl-quick-flow-close:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsl-quick-flow-trigger[data-live='true'] {
  color: var(--dsw-alias-brand-primary);
  border-color: var(--dsw-alias-brand-primary);
}
.dsl-quick-flow-count {
  color: var(--dsw-alias-label-secondary);
  font-variant-numeric: tabular-nums;
}
.dsl-quick-flow-popup {
  box-sizing: border-box;
  position: fixed;
  inset: auto;
  position-area: block-end span-inline-end;
  position-try-fallbacks: flip-inline, flip-block, flip-inline flip-block;
  margin: 6px 0;
  inline-size: min(430px, calc(100vw - 24px));
  max-block-size: min(58vh, 440px);
  overflow: auto;
  padding: 12px;
  border: 1px solid color-mix(in srgb, var(--dsw-alias-border-l2) 70%, var(--dsw-alias-bg-base));
  border-radius: 16px;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  box-shadow: inset 0 1px 0 rgb(255 255 255/.28),
    0 12px 34px color-mix(in srgb, var(--dsw-alias-label-primary) 16%, transparent);
  font-size: 13px;
  line-height: 1.5;
}
@supports (backdrop-filter: blur(1px)) {
  .dsl-quick-flow-popup {
    background: color-mix(in srgb, var(--dsw-alias-bg-base) 88%, transparent);
    backdrop-filter: blur(14px) saturate(125%);
  }
}
.dsl-quick-flow-popup .dsl-map-head {
  padding-inline-end: 66px;
}
.dsl-quick-flow-close {
  position: absolute;
  inset-block-start: 7px;
  inset-inline-end: 8px;
}
`;

function QuickFlow(props) {
  const { t, lang } = useLensLocale(props);
  const { turns } = useLensModel(props.useChat, lang);
  const popupId = React.useId();
  const turn = turns.at(-1);
  const popupRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const sessionId = props.sessionId;
  const previousSession = React.useRef(sessionId);
  const openedTurn = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [zoomTarget, setZoomTarget] = React.useState(null);
  const hasTurn = !!turn;
  const turnId = turn?.turn;
  const live = !!turn?.live;
  const actionContext = useActionReasoning(turn, lang, open || !!zoomTarget);

  React.useEffect(() => {
    const popup = popupRef.current;
    if (!popup) return undefined;
    const syncOpen = () => setOpen(popup.matches(':popover-open'));
    popup.addEventListener('toggle', syncOpen);
    syncOpen();
    return () => popup.removeEventListener('toggle', syncOpen);
  }, [hasTurn]);

  React.useEffect(() => {
    const popup = popupRef.current;
    if (previousSession.current !== sessionId) {
      previousSession.current = sessionId;
      if (popup?.matches(':popover-open')) popup.hidePopover();
    }
    if (!live || !popup || typeof popup.showPopover !== 'function') return;
    const lastTurn = sessionId == null ? openedTurn.current : quickFlowOpenedTurns.get(sessionId);
    if (lastTurn === turnId) return;

    if (!popup.matches(':popover-open')) popup.showPopover({ source: triggerRef.current });
    if (sessionId == null) openedTurn.current = turnId;
    else quickFlowOpenedTurns.set(sessionId, turnId);
  }, [sessionId, turnId, live]);

  React.useEffect(() => {
    setZoomTarget(null);
  }, [sessionId, turnId]);

  if (!turn) return null;

  const zoomStep = zoomTarget ? turn.steps.find((entry) => entry.step === zoomTarget.step) : null;

  const title = t('quickFlowTitle');
  const turnName = t('turnN', { n: turn.turn });
  const count = t('metaSteps', { n: turn.stepCount });
  const labelParts = [title, turnName, count];
  if (turn.live) labelParts.push(t('liveBadge'));
  return h(
    'div',
    { className: 'dsl-quick-flow' },
    h('style', null, QUICK_FLOW_STYLE + FLOW_OVERVIEW_STYLE),
    h(
      'button',
      {
        ref: triggerRef,
        type: 'button',
        className: 'dsl-quick-flow-trigger',
        popovertarget: popupId,
        'aria-controls': popupId,
        'aria-expanded': open,
        'aria-label': labelParts.join(' · '),
        'data-live': turn.live ? 'true' : 'false',
      },
      h(
        'svg',
        {
          width: 16,
          height: 14,
          viewBox: '0 0 16 14',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.25,
          'aria-hidden': true,
        },
        h('path', { d: 'M4 7.5v4.25h5.75M7 4.75h4.75' }),
        h('rect', { x: 1, y: 2, width: 6, height: 5.5, rx: 1.25 }),
        h('circle', { cx: 13.3, cy: 4.75, r: 1.7 }),
        h('circle', { cx: 11.5, cy: 11.75, r: 1.7 }),
      ),
      h('span', null, title),
      h('span', { className: 'dsl-quick-flow-count', 'aria-hidden': true }, turn.stepCount),
    ),
    h(
      'section',
      {
        ref: popupRef,
        id: popupId,
        className: 'dsl-quick-flow-popup',
        popover: 'auto',
        'aria-label': [title, turnName].join(' · '),
      },
      h(
        'button',
        {
          type: 'button',
          className: 'dsl-quick-flow-close',
          popovertarget: popupId,
          popovertargetaction: 'hide',
        },
        t('quickFlowClose'),
      ),
      h(FlowOverview, {
        turn,
        t,
        lang,
        compact: true,
        visible: open,
        actionContext,
        onStep: (stepNumber, actionKey) => {
          const popup = popupRef.current;
          if (popup && popup.matches(':popover-open')) popup.hidePopover();
          setZoomTarget({ step: stepNumber, actionKey });
        },
      }),
    ),
    zoomTarget && zoomStep
      ? h(
          ZoomDialog,
          {
            t,
            kicker: [t('turnN', { n: turn.turn }), t('stepN', { k: zoomStep.step, total: turn.stepCount })].join(' · '),
            title: zoomTargetTitle(turn, zoomStep, zoomTarget.actionKey, t, lang, actionContext),
            onClose: () => {
              setZoomTarget(null);
              triggerRef.current?.focus({ preventScroll: true });
            },
          },
          h(ZoomContent, {
            turn,
            step: zoomStep,
            actionKey: zoomTarget.actionKey,
            t,
            lang,
            actionContext,
          }),
        )
      : null,
  );
}

/** Add a session-scoped flow preview beside the host conversation title. */
function registerQuickFlow(ctx) {
  const name = 'conversation.session.header.actions';
  const t = ctx.locale.bind('learn');
  ctx.slots.inject(name, () => ctx.slots.register({
    name,
    id: 'step-lens-quick-flow',
    order: -20,
    label: () => t('quickFlowTitle'),
  }, QuickFlow));
}


    return {
      inject: ['slots', 'locale'],
      apply: installClientPlugin,
    };
  },
});
