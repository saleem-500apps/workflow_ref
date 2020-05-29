var _addEndpoints = function (toId, sourceAnchors, targetAnchors) {
  debugger;
  for (var i = 0; i < sourceAnchors.length; i++) {
    var sourceUUID = toId + sourceAnchors[i];
    instance.addEndpoint(toId, sourceEndpoint, {
      anchor: sourceAnchors[i],
      uuid: sourceUUID,
    });
  }
  for (var j = 0; j < targetAnchors.length; j++) {
    var targetUUID = toId + targetAnchors[j];
    instance.addEndpoint(toId, targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID });
  }
};

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
var init = function (connection) {
  debugger;
  connection.getOverlay('label').setLabel(connection.sourceId + '-' + connection.targetId);
};

search = (Eventdata) => {
  console.log(Eventdata.target.value);
};

var instance;
const invoke = jsPlumb.ready(function () {
  instance = window.jsp = jsPlumb.getInstance({
    // Default drag options
    DragOptions: { cursor: 'pointer', zIndex: 2000 },
    // The overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
    // Case it returns the 'labelText' member that we set on each connection in the 'init' method below.
    ConnectionOverlays: [
      [
        'Arrow',
        {
          location: 1,
          visible: true,
          width: 11,
          length: 11,
          id: 'ARROW',
          events: {
            click: function () {
              alert('you clicked on the arrow overlay');
            },
          },
        },
      ],
      [
        'Label',
        {
          location: 0.1,
          id: 'label',
          cssClass: 'aLabel',
          events: {
            tap: function () {
              alert('hey');
            },
          },
        },
      ],
    ],
    Container: 'canvas',
  });

  var basicType = {
    connector: 'StateMachine',
    paintStyle: { stroke: 'red', strokeWidth: 4 },
    hoverPaintStyle: { stroke: 'blue' },
    overlays: ['Arrow'],
  };
  instance.registerConnectionType('basic', basicType);
  instance.batch(function () {
    _addEndpoints('flowchartstart', ['BottomCenter'], []);
    instance.draggable(jsPlumb.getSelector('.flowchart-demo .window'), { grid: [10, 10] });
  });
  instance.bind('dblclick', function (conn, originalEvent) {
    if (confirm('Delete connection from ' + conn.sourceId + ' to ' + conn.targetId + '?')) instance.deleteConnection(conn);
    conn.toggleType('basic');
  });
  jsPlumb.fire('jsPlumbDemoLoaded', instance);
});
