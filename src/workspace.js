//import jsPlumb from 'jsplumb';
var connectorPaintStyle = {
    strokeWidth: 2,
    stroke: '#61B7CF',
    joinstyle: 'round',
    outlineStroke: 'white',
    outlineWidth: 2,
};
// .. and this is the hover style.
var connectorHoverStyle = {
    strokeWidth: 3,
    stroke: '#216477',
    outlineWidth: 5,
    outlineStroke: 'white',
};
var endpointHoverStyle = {
    fill: '#216477',
    stroke: '#216477',
};
// The definition of source endpoints (the small blue ones)
var sourceEndpoint = {
    endpoint: 'Dot',
    paintStyle: {
        stroke: '#7AB02C',
        fill: 'transparent',
        radius: 7,
        strokeWidth: 1,
    },
    isSource: true,
    connector: ['Flowchart', { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],
    connectorStyle: connectorPaintStyle,
    hoverPaintStyle: endpointHoverStyle,
    connectorHoverStyle: connectorHoverStyle,
    dragOptions: {},
    overlays: [
        [
            'Label',
            {
                location: [0.5, 1.5],
                label: '', // Drag
                cssClass: 'endpointSourceLabel',
                visible: true,
            },
        ],
    ],
};
// The definition of target endpoints (will appear when the user drags a connection)
var targetEndpoint = {
    endpoint: 'Dot',
    paintStyle: { fill: '#7AB02C', radius: 7 },
    hoverPaintStyle: endpointHoverStyle,
    maxConnections: -1,
    dropOptions: { hoverClass: 'hover', activeClass: 'active' },
    isTarget: true,
    overlays: [['Label', { location: [0.5, -0.5], label: '', cssClass: 'endpointTargetLabel', visible: true }]],
};

class Workspace {
  init() {
    debugger;
    // Use jsPlumb here
    const that = this;
    jsPlumb.ready(function () {
      // Create jsPlumb instance and set to this
      // TODO:
        that.jsPlumb = global.instance =  window.jsp = jsPlumb.getInstance({
         // default drag options
         DragOptions: { cursor: 'pointer', zIndex: 2000 },
         // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
         // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
         ConnectionOverlays: [
                ["Arrow", {
                    location: 1,
                    visible: true,
                    width: 11,
                    length: 11,
                    id: "ARROW",
                    events: {
                        click: function () { alert("you clicked on the arrow overlay") }
                    }
                }],
                ["Label", {
                    location: 0.1,
                    id: "label",
                    cssClass: "aLabel",
                    events: {
                        tap: function () { alert("hey"); }
                    }
                }]
            ],
         Container: "canvas"
      });
      
      // Deserialize
        that.deserialize();
        /*var basicType = {
            connector: "StateMachine",
            paintStyle: { stroke: "red", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            overlays: [
                "Arrow"
            ]
        };
        that.jsPlumb.registerConnectionType("basic", basicType);
        that.jsPlumb.batch(function () {
            this._addEndpoints("flowchartstart", ["BottomCenter"], []);
            that.jsPlumb.draggable(jsPlumb.getSelector(".flowchart-demo .window"), { grid: [10, 10] });
        });
        that.jsPlumb.bind("dblclick", function (conn, originalEvent) {
            if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
                that.jsPlumb.deleteConnection(conn);
            conn.toggleType("basic");
        });
        jsPlumb.fire("jsPlumbDemoLoaded", that.jsPlumb); */
    });

    //
  }

  // TODO:
  deserialize() {
    // If global.dataJSON is defined, deserialize
    // eslint-disable-next-line no-useless-return
    //if (!global.dataJSON) return;
    var basicType = {
        connector: "StateMachine",
        paintStyle: { stroke: "red", strokeWidth: 4 },
        hoverPaintStyle: { stroke: "blue" },
        overlays: [
            "Arrow"
        ]
    };
    global.instance.registerConnectionType("basic", basicType);
    global.instance.batch(function () {
        this._addEndpoints("flowchartstart", ["BottomCenter"], []);
        global.instance.draggable(jsPlumb.getSelector(".flowchart-demo .window"), { grid: [10, 10] });
    });
    global.instance.bind("dblclick", function (conn, originalEvent) {
        if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
        global.instance.deleteConnection(conn);
        conn.toggleType("basic");
    });
    //jsPlumb.fire("jsPlumbDemoLoaded", global.instance); 
    // Read dataJSON from a file from data folder to test for now
  }

  _addEndpoints(toId, sourceAnchors, targetAnchors) {
      debugger;
     for (var i = 0; i < sourceAnchors.length; i++) {
       var sourceUUID = toId + sourceAnchors[i];
       global.instance.addEndpoint(toId, sourceEndpoint, {
          anchor: sourceAnchors[i], uuid: sourceUUID
       });
     }
     for (var j = 0; j < targetAnchors.length; j++) {
       var targetUUID = toId + targetAnchors[j];
       global.instance.addEndpoint(toId, targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID });
     }
    }

  drop(ev) {
     ev.preventDefault();
        //let id = ev.dataTransfer.getData("activeid");
     let id = ev.dataTransfer.getData("id");
        //let cat = ev.dataTransfer.getData("activeCat");
     let step = global.workflowJSON.fields.find(i => i.name == id);
     let UUID = step.id + this.randomString();

        //Toolbar.dragComplete({ "uuid": unquId, "category": cat, "index": ev.dataTransfer.getData("index"), "event": ev });
     Toolbar.dragComplete({ "id": id,  "event": ev, "UUID": UUID });
   }

  randomString() {
     var result = '';
     var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     for (var i = 0; i < 4; i++) {
       result += characters.charAt(Math.floor(Math.random() * characters.length));
     }
     return result;
  }

  allowDrop(ev) {
     ev.preventDefault();
  }
}

export default new Workspace();
