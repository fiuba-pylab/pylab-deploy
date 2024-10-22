self.MonacoEnvironment = {
    baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.27.0/min/'
};

importScripts(self.MonacoEnvironment.baseUrl + 'vs/base/worker/workerMain.js');
