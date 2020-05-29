import './designer.css';
import WorkflowJSON from '../data/data.json';
import Toolbar from './toolbar';
import Workspace from './workspace';
import Modal from './modal';

// Store JSON in global
debugger;
global.workflowJSON = WorkflowJSON;
global.Toolbar = Toolbar;
global.Workspace = Workspace;
global.Modal = Modal;
global.instance;
console.log(WorkflowJSON);

// Start the Toolbar init when ready
function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
ready(function () {
  Toolbar.init();
  Workspace.init();
});

function test() {
    alert("in index");
}
