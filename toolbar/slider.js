var workflow_object = {
  nodes: []
}
var edit_grid_event;
var dropEvent;
var node_uuid;

const showModal = (obj) => {
  modals.myModal = document.getElementById('myModal')
  modals.myModal.style.display = 'block';
  var data = nodesData[obj.category][obj.index];
  sort(data.ui);
  dropEvent = obj.event;
  node_uuid = obj.uuid;
  var new_obj = { data, event: obj, index: obj.index };
  if (obj.edit) new_obj.edit = obj.edit;
  getModalData(new_obj);
}

const closeModal = (modal) => {
  modals[modal].style.display = 'none';
}

const openTab = (obj) => {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName('tabcontent');
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none';
  }
  tablinks = document.getElementsByClassName('tablinks');
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');
  }
  document.getElementById(obj.category + '_tab').style.display = 'block';
  obj.event.currentTarget.className += ' active';
}

const getModalData = (obj) => {
  var data = obj.data;
  console.log(data, sortedData);
  var tabs = '';
  var tab_content = '';
  for (category in sortedData) {
    if (Object.keys(sortedData)[0] == category) tabs += '<button class="tablinks active" onclick="openTab({\'event\':event, \'category\':\'' + category + '\'})">' + category + '</button>';
    else tabs += '<button class="tablinks" onclick="openTab({\'event\':event, \'category\':\'' + category + '\'})">' + category + '</button>';
    var tab_data = '';
    for (item in sortedData[category]) {
      fieldsData(sortedData[category][item]);
      var label = '';
      if (sortedData[category][item].label) label = '<p>' + sortedData[category][item].label + '</p>'
      tab_data = tab_data + '<div class="mt-4">' + label + field + '</div>'
    }
    if (Object.keys(sortedData)[0] == category) tab_content += '<div id="' + category + '_tab" class="tabcontent" style="display: block;">' + tab_data + '</div>';
    else tab_content += '<div id="' + category + '_tab" class="tabcontent">' + tab_data + '</div>';
  }

  var btn = '<button class="btn btn-primary" onclick="saveModalData({\'id\':\'main-form\',\'category\':\'' + data.category + '\',\'index\':\'' + obj.index + '\'})">Save</button>'
  if (obj.edit) btn = '<button class="btn btn-primary" onclick="updateModalData({\'id\':\'main-form\',\'category\':\'' + data.category + '\',\'index\':\'' + obj.index + '\',\'edit\':\'' + obj.edit + '\'})">Update</button>'
  var html = '<h4>' + data.displayname + `</h4>
        <div class="d-flex mb-4" style="height: 75px;">
            <img id="icon" border="0" src="https://our.appup.com/app/designer/` + data.icon + `" width="66px" height="66px" style="float:left;margin-right: 10px">
            <p class="border p-3 mr-3 overflow-scroll" style="width: 360px;">` + data.info + `</p>
            <div class="border p-3"><b>Node name</b><p class="border p-2 ellipsis" style="width: 185px;">` + data.name + `</p></div>
        </div>
        <div class="tab">` + tabs + `</div>
        <form id="main-form" name="main-form">` + tab_content + `</form>
        <div id="error-message" class="mt-2"></div>
        <div class="d-flex mt-4 float-right">` + btn + `<button class="btn btn-secondary ml-3" onclick="closeModal('myModal')">Cancel</button>
        </div>`;

  document.getElementById('modal-content').innerHTML = html;
}

const fieldsData = (data) => {
  if (data.fieldType == 'input') field = '<input type="' + data.type + '" name="' + data.name + '" id="' + data.name + '" class="form-control" title="' + data.title + '" />';
  else if (data.fieldType == 'select') {
    var options = '';
    for (var i in data.options) {
      options += '<option value="' + data.options[i] + '">' + i + '</option>'
    }
    field = '<select name="' + data.name + '" id="' + data.name + '" class="form-control" title="' + data.title + '"  >' + options + '</select>'
  } else if (data.fieldType == 'textarea') field = '<textarea name="' + data.name + '" id="' + data.name + '" class="form-control" title="' + data.title + '" ></textarea>';
  else if (data.fieldType == 'dynamicselect' && data.type == 'select') {
    fetch(data.url, { method: 'GET' })
      .then(response => response.json()).then(result => {
        console.log('Success:', result); var options = '';
        for (var i in result) {
          options += '<option value="' + result[i][data.dynamicValue] + '">' + result[i][data.dynamicName] + '</option>'
        }
        field = '<select name="' + data.name + '" id="' + data.name + '" class="form-control" title="' + data.title + '" required="' + data.required + '" >' + options + '</select>'
      })
  } else if (data.fieldType == 'grid') {
    console.log(data);
    var header = '';
    for (var i = 0; i < data.ui.length; i++) {
      header += '<p class="form-header">' + data.ui[i].label + '</p>';
    }
    field = '<div id="' + data.id + '"><div class="d-flex">' + header + '<i class="mx-4"></i></div></div><button class="btn d-flex" style="height: 35px;" onclick="showGrid({\'id\':\'' + data.id + '\',\'category\':\'' + category + '\',\'index\':\'' + item + '\'},event)"><i class="material-icons" style="font-size: 15px;margin-top: 2px;">add_circle_outline</i> <p>Add</p></button>';
  }
}
const showGrid = (obj, event) => {
  debugger;
  event.preventDefault();
  var html = '<h4>' + sortedData[obj.category][obj.index].label + '</h4><form id="' + obj.id + '_form" name="' + obj.id + '_form">';
  for (item in sortedData[obj.category][obj.index].ui) {
    fieldsData(sortedData[obj.category][obj.index].ui[item]);
    var label = '';
    if (sortedData[obj.category][obj.index].ui[item].label) label = '<p>' + sortedData[obj.category][obj.index].ui[item].label + '</p>'
    html = html + '<div class="mt-4">' + label + field + '</div>'
  }
  var btn = '<button class="btn btn-primary" onclick="saveGridData({\'id\':\'' + obj.id + '\',\'category\':\'' + obj.category + '\',\'index\':' + obj.index + '})" value="Submit">Add</button>';
  if (obj.edit) {
    edit_grid_event = obj.event.currentTarget;
    btn = '<button class="btn btn-primary" onclick="editGridData({\'id\':\'' + obj.id + '\',\'category\':\'' + obj.category + '\',\'index\':' + obj.index + '})" value="Submit">Update</button>';
  }
  html += '</form><div class="d-flex mt-4 float-right">' + btn + `<button class="btn btn-secondary ml-3" onclick="closeModal('gridModal')">Cancel</button>
    </div>`
  document.getElementById('grid-modal-content').innerHTML = html;
  modals.gridModal = document.getElementById('gridModal');
  modals.gridModal.style.display = 'block';
}

const saveGridData = (obj) => {
  console.log(obj);
  /* Var data = [];
    for (var i = 0; i < document.forms[obj.id+'_form'].elements.length; i++) {
        data.push({
            "name": document.forms[obj.id + '_form'].elements[i].name,
            "value": document.forms[obj.id + '_form'].elements[i].value
        });
    } */
  // Var html = '';
  var field_data = '';
  const id = document.getElementById(sortedData[obj.category][obj.index].id).children.length;
  for (item in sortedData[obj.category][obj.index].ui) {
    field_data += '<input type="' + sortedData[obj.category][obj.index].ui[item].type + '" name="' + obj.id + '.' + id + '.' + sortedData[obj.category][obj.index].ui[item].name + '" id="' + obj.id + '.' + id + '.' + sortedData[obj.category][obj.index].ui[item].name + '" class="form-control mr-3" title="' + sortedData[obj.category][obj.index].ui[item].title + '" disabled/>';
  }
  // Html = `<div class="my-3 d-flex">` + field_data + `<i class="material-icons pointer mt-2 mr-2" style="font-size: 16px;" onclick="editGrid({'id':'` + obj.id + `','category':'` + obj.category + `','index':` + obj.index +`,'event':event})">mode_edit</i><i class="fa fa-trash-o pointer mt-2" onclick="deleteGrid({'event': event})"></i></div>`
  var html = document.createElement('div');
  html.setAttribute('class', 'my-3 d-flex');
  html.innerHTML = field_data + '<i class="material-icons pointer mt-2 mr-2" style="font-size: 16px;" onclick="editGrid({\'id\':\'' + obj.id + '\',\'category\':\'' + obj.category + '\',\'index\':' + obj.index + ',\'event\':event})">mode_edit</i><i class="fa fa-trash-o pointer mt-2" onclick="deleteGrid({\'event\': event})"></i>';
  document.getElementById(obj.id).appendChild(html);
  /* Document.getElementById(obj.id).innerHTML += html; */
  for (var i = 0; i < document.forms[obj.id + '_form'].elements.length; i++) {
    document.getElementById(obj.id + '.' + id + '.' + sortedData[obj.category][obj.index].ui[i].name).value = document.forms[obj.id + '_form'].elements[i].value
  }
  closeModal('gridModal');
}

const saveModalData = (obj) => {
  if (validateData(obj)) {
    var data = saveData(obj);
    console.log(data);
    closeModal('myModal');
    workflow_object.nodes.push({
      NodeDefinition: nodesData[obj.category.toLowerCase()][obj.index],
      id: node_uuid,
      JsonValues: data
    });
    const dropedContent = nodesData[obj.category.toLowerCase()][obj.index];
    const NodeDesign = '<div class="window jtk-node icon-hover" id="' + node_uuid + '" style="top: ' + dropEvent.offsetY + 'px;left: ' + dropEvent.offsetX + `px;">
            <div style="position: absolute;top:0%; right: 0%"><i class="material-icons pointer mt-2 mr-2 text-primary" style="font-size: 16px;" onclick="editModal({'id':'` + node_uuid + `'})">mode_edit</i></div>
            <div style="position: absolute;top: 23%;height: 61px; width: 85px;"><img width="100%" height="100%"  src="https://our.appup.com/app/designer/` + dropedContent.icon + '"><p style="font-weight: bold">' + dropedContent.name + `</p></div>
    </div>`
    document.getElementById('canvas').insertAdjacentHTML('beforeend', NodeDesign);
    _addEndpoints(node_uuid, ['LeftMiddle', 'RightMiddle'], ['TopCenter']);
    instance.draggable(jsPlumb.getSelector('.flowchart-demo .window'), { grid: [5, 5] });
  }
}

function validateData(obj) {
  console.log(obj);
  var data = nodesData[obj.category.toLocaleLowerCase()][obj.index].ui;
  var arr = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i].required) {
      if (document.getElementById(data[i].id).value == '') {
        arr.push(data[i].label);
        document.getElementById(data[i].id).classList.add('border-danger');
      } else if (document.getElementById(data[i].id).value != '' && document.getElementById(data[i].id).className.indexOf('border-danger') !== -1) {
        document.getElementById(data[i].id).classList.remove('border-danger');
      }
    }
  }
  if (arr.length == 0) {
    return true;
  } else {
    document.getElementById('error-message').innerHTML = '<p class="text-danger border border-danger p-2 pl-4"><i class="fa fa-info-circle"></i>&nbsp;&nbsp;' + arr.toString() + ' is required</p>';
    return false;
  }
}

function saveData(obj) {
  var data = [];
  var grid_id = 0;
  var grid_obj = {};
  var grid_index;
  for (var i = 0; i < document.forms[obj.id].elements.length; i++) {
    if (document.forms[obj.id].elements[i].nodeName != 'BUTTON' && !document.forms[obj.id].elements[i].id.includes('.')) {
      data.push({
        name: document.forms[obj.id].elements[i].name,
        value: document.forms[obj.id].elements[i].value
      });
    } else if (document.forms[obj.id].elements[i].id.includes('.')) {
      var val = document.forms[obj.id].elements[i].id.split('.')
      if (data.filter(i => i[val[0]]).length == 0) {
        const new_obj = {};
        new_obj[val[0]] = []
        data.push(new_obj);
        grid_index = data.findIndex(i => i[val[0]]);
      }
      if (val[1] == grid_id) {
        grid_obj[val[2]] = document.forms[obj.id].elements[i].value;
        if (Object.keys(grid_obj).length == nodesData[obj.category.toLowerCase()][obj.index].ui.find(i => i.id == val[0]).ui.length) {
          data[grid_index][val[0]].push(grid_obj);
          grid_obj = {};
        }
      } else {
        grid_id = val[1];
        // If (Object.keys(grid_obj).length > 0) data[grid_index][val[0]].push(grid_obj);
        grid_obj = {};
        grid_obj[val[2]] = document.forms[obj.id].elements[i].value;
      }
    }
  }
  // If (Object.keys(grid_obj).length > 0) data[grid_index][val[0]].push(grid_obj);
  return data;
}

const updateModalData = (obj) => {
  if (validateData(obj)) {
    console.log(obj);
    var data = saveData(obj);
    var index = workflow_object.nodes.findIndex(i => i.id == obj.edit);
    workflow_object.nodes[index].JsonValues = data;
    closeModal('myModal');
  }
}

const editModal = (obj) => {
  console.log(obj);
  var node = workflow_object.nodes.find(i => i.id == obj.id)
  // Var index = workflow_object.nodes.findIndex(i => i.id == obj.id);
  var id = nodesData[node.NodeDefinition.category.toLocaleLowerCase()].findIndex(i => i == node.NodeDefinition);
  showModal({ category: node.NodeDefinition.category.toLocaleLowerCase(), index: id, edit: obj.id });
  for (var i = 0; i < node.NodeDefinition.ui.length; i++) {
    if (node.NodeDefinition.ui[i].fieldType != 'grid') {
      document.getElementById(node.NodeDefinition.ui[i].name).value = node.JsonValues.find(k => { if (k.name && k.name == node.NodeDefinition.ui[i].name) return k; }).value;
    } else {
      debugger;
      var index = sortedData[node.NodeDefinition.ui[i].category.toLowerCase()].findIndex(l => l.name == node.NodeDefinition.ui[i].name)
      var data = node.JsonValues.find(k => k[node.NodeDefinition.ui[i].name])[node.NodeDefinition.ui[i].name];
      var html = '';
      for (var j = 0; j < data.length; j++) {
        // Let id = document.getElementById(sortedData[obj.category][obj.index].id).children.length;
        var field_data = '';
        for (item in node.NodeDefinition.ui[i].ui) {
          field_data += '<input type="' + node.NodeDefinition.ui[i].ui[item].type + '" name="' + node.NodeDefinition.ui[i].name + '.' + j + '.' + node.NodeDefinition.ui[i].ui[item].name + '" id="' + node.NodeDefinition.ui[i].name + '.' + j + '.' + node.NodeDefinition.ui[i].ui[item].name + '" class="form-control mr-3" title="' + node.NodeDefinition.ui[i].ui[item].title + '" disabled/>';
        }
        html += '<div class="my-3 d-flex">' + field_data + '<i class="material-icons pointer mt-2 mr-2" style="font-size: 16px;" onclick="editGrid({\'id\':\'' + node.NodeDefinition.ui[i].name + '\',\'category\':\'' + node.NodeDefinition.ui[i].category.toLocaleLowerCase() + '\',\'index\':' + index + ',\'event\':event})">mode_edit</i><i class="fa fa-trash-o pointer mt-2" onclick="deleteGrid({\'event\': event})"></i></div>'
      }
      document.getElementById(node.NodeDefinition.ui[i].name).innerHTML = html;
      for (var j = 0; j < data.length; j++) {
        for (var k in data[j]) {
          document.getElementById(node.NodeDefinition.ui[i].name + '.' + j + '.' + k).value = data[j][k]
        }
      }
    }
  }
}

const deleteGrid = (obj) => {
  console.log(obj);
  obj.event.currentTarget.parentElement.remove();
}

const editGrid = (obj) => {
  obj.edit = true;
  showGrid(obj);
  for (var i in sortedData[obj.category][obj.index].ui) {
    document.getElementById(obj.id + '_form').children[i].children[1].value = obj.event.currentTarget.parentElement.children[i].value
  }
}

const editGridData = (obj) => {
  console.log(edit_grid_event);
  for (var i in sortedData[obj.category][obj.index].ui) {
    document.getElementById(edit_grid_event.parentElement.children[i].id).value = document.getElementById(obj.id + '_form').children[i].children[1].value;
    // Edit_grid_event.parentElement.children[i].value = document.getElementById(obj.id + '_form').children[i].children[1].value;
    // Document.getElementById(obj.id).children[0].children[i].value = document.getElementById(obj.id + '_form').children[i].children[1].value;
  }
  closeModal('gridModal');
}
