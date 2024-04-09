# Q: Is it possible to import workflow through command line, using worker n8n instance?

Question assumes that we have n8n is configured in [queue mode](https://docs.n8n.io/hosting/scaling/queue-mode/) with one main n8n instance and few workers.

The answer is: Yes, it works.


## Background of this question

There is a tool called [8man](https://github.com/digital-boss/n8n-manager) which helps you to manage n8n instances through command line. It communicates with n8n through REST interface.

With 8man you can import workflows. And it uses an internal workflow to import by calling the command `n8n import:workflow --input=/home/node/workflow-to-import.json`. But in queue mode it is worker instances who executes every workflow. So will it actually import wofkflow correctly in we run `n8n import:workflow` at the worker instance (and not at main)?


## How it was tested?

Tested on [n8nio/n8n:1.36.1](https://hub.docker.com/layers/n8nio/n8n/1.36.1/images/sha256-196622856a89f7b38ad4f72ec435fb62863e23517d3912499e846c406c6efbbb?context=explore)

1. Deploy: ./manage.sh redeploy scale=4

2. Import:

```
$ docker exec -ti docker-n8n-worker-4 sh
$ cat ./wf.json 
[{
  "name": "My workflow",
  ...
}]
~ $ n8n import:workflow --input=./wf.json
User settings loaded from: /home/node/.n8n/config
Successfully imported 1 workflow.
```

3. Check imported workflow in n8n UI: http://localhost:5678/workflows