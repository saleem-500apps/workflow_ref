import _ from 'lodash';

var event;
class Toolbar {
  init() {
    console.log('Toolbar');

    // Get categories
    const categories = this.getCategories();
    console.log(categories);

    // Add Category to the sidebar
    categories.forEach((category) => this.addCategory(category));
  }

  // Get Categories
  getCategories() {
    const categories = [];
    global.workflowJSON.fields.forEach((field) => {
      // Check if it already exists
      const result = categories.findIndex((item) => field.category.toLowerCase() === item.toLowerCase());
      if (result === -1) categories.push(field.category);
    });
    return categories;
  }

  // Get step template
  getStepTemplate(step, stepTemplate) {
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
    var interpolator = _.template(stepTemplate);
    return interpolator(step);
  }

  // Add category - and then steps
  addCategory(name) {
    const id = 'submenu' + Math.floor(Math.random() * 1000) + 1;
    const html = this.getStepTemplate({ name: name, menu: id }, require('./html/toolbar/category.html'));
    console.log(html);
    this.addHTMLToID('sidebarui', html);
      
    // Get Steps for this category
    const steps = this.getSteps(name, id);

    // Add steps to the category
    steps.forEach((step) => {
      this.addStepToCategory(step, name, id);
    });
  }

  getSteps(category) {
    return global.workflowJSON.fields.filter((item) => item.category === category);
  }

  addStepToCategory(step, category, id) {
    const html = this.getStepTemplate({ name: step.name, icon: step.icon }, require('./html/toolbar/step.html'));
    this.addHTMLToID(id, html);
  }

  // Add HTML to element
  addHTML(element, html) {
    var child = document.createElement('div');
    child.innerHTML = html;
    child = child.firstChild;

    // Add HTML in the element itself
    element.insertAdjacentHTML('beforeend', html);
    return element;
  }

  // Add HTML to ID.
  addHTMLToID(id, html) {
    const element = document.getElementById(id);
    return this.addHTML(element, html);
  }

  // TODO:
  setDraggable(step,id) {
    //step.dataTransfer.setData("activeid", step.currentTarget.id);
    //step.dataTransfer.setData("activeCat", step.currentTarget.title);
    step.dataTransfer.setData("id", id);
    console.log(step);
  }

  // TODO: DragComplete
  dragComplete(obj) {
    console.log(obj);
    Modal.show(obj);
    event = obj.event;
    /*let step = global.workflowJSON.fields.find(i => i.name == obj.id);
    const html = this.getStepTemplate({ event: obj.event, name: step.name, icon: step.icon, id: step.UUID }, require('./html/workspace/node.html'));
    document.getElementById("canvas").insertAdjacentHTML('beforeend', html);
    Workspace._addEndpoints(obj.UUID, ["LeftMiddle", "RightMiddle"], ["TopCenter"]);
    global.instance.draggable(jsPlumb.getSelector(".flowchart-demo .window"), { grid: [5, 5] });*/

    // Show modal or do something
  }

  save(obj) {
      Modal.close('nodeModal');
      let step = global.workflowJSON.fields.find(i => i.name == obj.id);
      const html = this.getStepTemplate({ event: event, name: step.name, icon: step.icon, id: step.UUID }, require('./html/workspace/node.html'));
      document.getElementById("canvas").insertAdjacentHTML('beforeend', html);
      Workspace._addEndpoints(obj.UUID, ["LeftMiddle", "RightMiddle"], ["TopCenter"]);
      global.instance.draggable(jsPlumb.getSelector(".flowchart-demo .window"), { grid: [5, 5] });
  }


}

export default new Toolbar();
