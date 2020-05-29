var modals = {};

class Modal {
  show(step) {
    return new Promise((resolve, reject) => {
      // Show UI
        let data = global.workflowJSON.fields.find(i => i.name == step.id);
        const categories = this.getCategories(data.ui);
        console.log(categories);

        
        //const btnHtml = Toolbar.getStepTemplate({ type: 'Save', method: 'Toolbar.save', data: step, modal: 'nodeModal' }, require('./html/modal/button.html'));
        /*var fieldHtml = '';
        for (var i in data.ui) {
            fieldHtml += Toolbar.getStepTemplate({ step: data.ui[i] }, require('./html/modal/field.html'));
        }
        console.log(fieldHtml);
        var html = fieldHtml+btnHtml;*/
        var html = Toolbar.getStepTemplate({ label: data.displayname, icon: data.icon, info: data.info, name: data.name, type: 'Save', method: 'Toolbar.save', data: step }, require('./html/modal/content.html'));
        Toolbar.addHTMLToID('modal-content', html);
        // Add Category to the modal
        categories.forEach((category) => this.addCategory(category, data.ui));
        document.getElementById('tabsui').firstElementChild.firstElementChild.classList.add("active");
        document.getElementById('tabcontentui').firstElementChild.classList.add("active");
        modals["nodeModal"] = document.getElementById("myModal")
        modals["nodeModal"].style.display = "block";
      // OK, call
      //resolve(data);

      // Cancel
      //reject();
    });
  }

  close(modal,id) {
      modals[modal].style.display = "none";
      var node = document.getElementById(id);
      var child = node.lastElementChild;
      while (child) {
          node.removeChild(child);
          child = node.lastElementChild;
      } 
  }

// Get Categories
  getCategories(data) {
    const categories = [];
    data.forEach((field) => {
      // Check if it already exists
      const result = categories.findIndex((item) => field.category.toLowerCase() === item.toLowerCase());
      if (result === -1) categories.push(field.category);
    });
    return categories;
  }

    // Add category - and then steps
  addCategory(name,data) {
      const id = 'tab' + Math.floor(Math.random() * 1000) + 1;
      const html = Toolbar.getStepTemplate({ name: name, id: id }, require('./html/modal/category.html')); 
      console.log(html);
      Toolbar.addHTMLToID('tabsui', html);
      const tabHtml = Toolbar.getStepTemplate({ id: id }, require('./html/modal/tab-content.html')); 
      Toolbar.addHTMLToID('tabcontentui', tabHtml);
    // Get fields for this category
    const fields = this.getFields(name, data);

    // Add steps to the category
    fields.forEach((step) => {
      this.addFieldToCategory(step, name, id);
    });
  }

  getFields(category,data) {
    return data.filter((item) => item.category === category);
  }

  addFieldToCategory(step, category, id) {
    const html = Toolbar.getStepTemplate({ step: step }, require('./html/modal/field.html'));
    Toolbar.addHTMLToID(id, html);
  }
}

export default new Modal();