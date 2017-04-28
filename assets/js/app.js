(function () {
'use strict';

/** Virtual DOM Node */
function VNode() {}

/** Global options
 *	@public
 *	@namespace options {Object}
 */
var options = {

	/** If `true`, `prop` changes trigger synchronous component updates.
  *	@name syncComponentUpdates
  *	@type Boolean
  *	@default true
  */
	//syncComponentUpdates: true,

	/** Processes all created VNodes.
  *	@param {VNode} vnode	A newly-created VNode to normalize/process
  */
	//vnode(vnode) { }

	/** Hook invoked after a component is mounted. */
	// afterMount(component) { }

	/** Hook invoked after the DOM is updated with a component's latest render. */
	// afterUpdate(component) { }

	/** Hook invoked immediately before a component is unmounted. */
	// beforeUnmount(component) { }
};

var stack = [];

var EMPTY_CHILDREN = [];

/** JSX/hyperscript reviver
*	Benchmarks: https://esbench.com/bench/57ee8f8e330ab09900a1a1a0
 *	@see http://jasonformat.com/wtf-is-jsx
 *	@public
 */
function h(nodeName, attributes) {
	var children = EMPTY_CHILDREN,
	    lastSimple = void 0,
	    child = void 0,
	    simple = void 0,
	    i = void 0;
	for (i = arguments.length; i-- > 2;) {
		stack.push(arguments[i]);
	}
	if (attributes && attributes.children != null) {
		if (!stack.length) stack.push(attributes.children);
		delete attributes.children;
	}
	while (stack.length) {
		if ((child = stack.pop()) && child.pop !== undefined) {
			for (i = child.length; i--;) {
				stack.push(child[i]);
			}
		} else {
			if (child === true || child === false) child = null;

			if (simple = typeof nodeName !== 'function') {
				if (child == null) child = '';else if (typeof child === 'number') child = String(child);else if (typeof child !== 'string') simple = false;
			}

			if (simple && lastSimple) {
				children[children.length - 1] += child;
			} else if (children === EMPTY_CHILDREN) {
				children = [child];
			} else {
				children.push(child);
			}

			lastSimple = simple;
		}
	}

	var p = new VNode();
	p.nodeName = nodeName;
	p.children = children;
	p.attributes = attributes == null ? undefined : attributes;
	p.key = attributes == null ? undefined : attributes.key;

	// if a "vnode hook" is defined, pass every created VNode to it
	if (options.vnode !== undefined) options.vnode(p);

	return p;
}

/** Copy own-properties from `props` onto `obj`.
 *	@returns obj
 *	@private
 */
function extend(obj, props) {
  for (var i in props) {
    obj[i] = props[i];
  }return obj;
}

function cloneElement(vnode, props) {
	return h(vnode.nodeName, extend(extend({}, vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
}

// render modes

var NO_RENDER = 0;
var SYNC_RENDER = 1;
var FORCE_RENDER = 2;
var ASYNC_RENDER = 3;

var ATTR_KEY = '__preactattr_';

// DOM properties that should NOT have "px" added when numeric
var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

/** Managed queue of dirty components to be re-rendered */

var items = [];

function enqueueRender(component) {
	if (!component._dirty && (component._dirty = true) && items.push(component) == 1) {
		(options.debounceRendering || setTimeout)(rerender);
	}
}

function rerender() {
	var p = void 0,
	    list = items;
	items = [];
	while (p = list.pop()) {
		if (p._dirty) renderComponent(p);
	}
}

/** Check if two nodes are equivalent.
 *	@param {Element} node
 *	@param {VNode} vnode
 *	@private
 */
function isSameNodeType(node, vnode, hydrating) {
	if (typeof vnode === 'string' || typeof vnode === 'number') {
		return node.splitText !== undefined;
	}
	if (typeof vnode.nodeName === 'string') {
		return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
	}
	return hydrating || node._componentConstructor === vnode.nodeName;
}

/** Check if an Element has a given normalized name.
*	@param {Element} node
*	@param {String} nodeName
 */
function isNamedNode(node, nodeName) {
	return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
}

/**
 * Reconstruct Component-style `props` from a VNode.
 * Ensures default/fallback values from `defaultProps`:
 * Own-properties of `defaultProps` not present in `vnode.attributes` are added.
 * @param {VNode} vnode
 * @returns {Object} props
 */
function getNodeProps(vnode) {
	var props = extend({}, vnode.attributes);
	props.children = vnode.children;

	var defaultProps = vnode.nodeName.defaultProps;
	if (defaultProps !== undefined) {
		for (var i in defaultProps) {
			if (props[i] === undefined) {
				props[i] = defaultProps[i];
			}
		}
	}

	return props;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/** Create an element with the given nodeName.
 *	@param {String} nodeName
 *	@param {Boolean} [isSvg=false]	If `true`, creates an element within the SVG namespace.
 *	@returns {Element} node
 */
function createNode(nodeName, isSvg) {
	var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
	node.normalizedNodeName = nodeName;
	return node;
}

/** Remove a child node from its parent if attached.
 *	@param {Element} node		The node to remove
 */
function removeNode(node) {
	if (node.parentNode) node.parentNode.removeChild(node);
}

/** Set a named attribute on the given Node, with special behavior for some names and event handlers.
 *	If `value` is `null`, the attribute/handler will be removed.
 *	@param {Element} node	An element to mutate
 *	@param {string} name	The name/key to set, such as an event or attribute name
 *	@param {any} old	The last value that was set for this name/node pair
 *	@param {any} value	An attribute value, such as a function to be used as an event handler
 *	@param {Boolean} isSvg	Are we currently diffing inside an svg?
 *	@private
 */
function setAccessor(node, name, old, value, isSvg) {
	if (name === 'className') name = 'class';

	if (name === 'key') {
		// ignore
	} else if (name === 'ref') {
		if (old) old(null);
		if (value) value(node);
	} else if (name === 'class' && !isSvg) {
		node.className = value || '';
	} else if (name === 'style') {
		if (!value || typeof value === 'string' || typeof old === 'string') {
			node.style.cssText = value || '';
		}
		if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
			if (typeof old !== 'string') {
				for (var i in old) {
					if (!(i in value)) node.style[i] = '';
				}
			}
			for (var _i in value) {
				node.style[_i] = typeof value[_i] === 'number' && IS_NON_DIMENSIONAL.test(_i) === false ? value[_i] + 'px' : value[_i];
			}
		}
	} else if (name === 'dangerouslySetInnerHTML') {
		if (value) node.innerHTML = value.__html || '';
	} else if (name[0] == 'o' && name[1] == 'n') {
		var useCapture = name !== (name = name.replace(/Capture$/, ''));
		name = name.toLowerCase().substring(2);
		if (value) {
			if (!old) node.addEventListener(name, eventProxy, useCapture);
		} else {
			node.removeEventListener(name, eventProxy, useCapture);
		}
		(node._listeners || (node._listeners = {}))[name] = value;
	} else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
		setProperty(node, name, value == null ? '' : value);
		if (value == null || value === false) node.removeAttribute(name);
	} else {
		var ns = isSvg && name !== (name = name.replace(/^xlink\:?/, ''));
		if (value == null || value === false) {
			if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());else node.removeAttribute(name);
		} else if (typeof value !== 'function') {
			if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);else node.setAttribute(name, value);
		}
	}
}

/** Attempt to set a DOM property to the given value.
 *	IE & FF throw for certain property-value combinations.
 */
function setProperty(node, name, value) {
	try {
		node[name] = value;
	} catch (e) {}
}

/** Proxy an event to hooked event handlers
 *	@private
 */
function eventProxy(e) {
	return this._listeners[e.type](options.event && options.event(e) || e);
}

/** Queue of components that have been mounted and are awaiting componentDidMount */
var mounts = [];

/** Diff recursion count, used to track the end of the diff cycle. */
var diffLevel = 0;

/** Global flag indicating if the diff is currently within an SVG */
var isSvgMode = false;

/** Global flag indicating if the diff is performing hydration */
var hydrating = false;

/** Invoke queued componentDidMount lifecycle methods */
function flushMounts() {
	var c = void 0;
	while (c = mounts.pop()) {
		if (options.afterMount) options.afterMount(c);
		if (c.componentDidMount) c.componentDidMount();
	}
}

/** Apply differences in a given vnode (and it's deep children) to a real DOM Node.
 *	@param {Element} [dom=null]		A DOM node to mutate into the shape of the `vnode`
 *	@param {VNode} vnode			A VNode (with descendants forming a tree) representing the desired DOM structure
 *	@returns {Element} dom			The created/mutated element
 *	@private
 */
function diff(dom, vnode, context, mountAll, parent, componentRoot) {
	// diffLevel having been 0 here indicates initial entry into the diff (not a subdiff)
	if (!diffLevel++) {
		// when first starting the diff, check if we're diffing an SVG or within an SVG
		isSvgMode = parent != null && parent.ownerSVGElement !== undefined;

		// hydration is inidicated by the existing element to be diffed not having a prop cache
		hydrating = dom != null && !(ATTR_KEY in dom);
	}

	var ret = idiff(dom, vnode, context, mountAll, componentRoot);

	// append the element if its a new parent
	if (parent && ret.parentNode !== parent) parent.appendChild(ret);

	// diffLevel being reduced to 0 means we're exiting the diff
	if (! --diffLevel) {
		hydrating = false;
		// invoke queued componentDidMount lifecycle methods
		if (!componentRoot) flushMounts();
	}

	return ret;
}

/** Internals of `diff()`, separated to allow bypassing diffLevel / mount flushing. */
function idiff(dom, vnode, context, mountAll, componentRoot) {
	var out = dom,
	    prevSvgMode = isSvgMode;

	// empty values (null & undefined) render as empty Text nodes
	if (vnode == null) vnode = '';

	// Fast case: Strings create/update Text nodes.
	if (typeof vnode === 'string') {

		// update if it's already a Text node:
		if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
			if (dom.nodeValue != vnode) {
				dom.nodeValue = vnode;
			}
		} else {
			// it wasn't a Text node: replace it with one and recycle the old Element
			out = document.createTextNode(vnode);
			if (dom) {
				if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
				recollectNodeTree(dom, true);
			}
		}

		out[ATTR_KEY] = true;

		return out;
	}

	// If the VNode represents a Component, perform a component diff:
	if (typeof vnode.nodeName === 'function') {
		return buildComponentFromVNode(dom, vnode, context, mountAll);
	}

	// Tracks entering and exiting SVG namespace when descending through the tree.
	isSvgMode = vnode.nodeName === 'svg' ? true : vnode.nodeName === 'foreignObject' ? false : isSvgMode;

	// If there's no existing element or it's the wrong type, create a new one:
	if (!dom || !isNamedNode(dom, String(vnode.nodeName))) {
		out = createNode(String(vnode.nodeName), isSvgMode);

		if (dom) {
			// move children into the replacement node
			while (dom.firstChild) {
				out.appendChild(dom.firstChild);
			} // if the previous Element was mounted into the DOM, replace it inline
			if (dom.parentNode) dom.parentNode.replaceChild(out, dom);

			// recycle the old element (skips non-Element node types)
			recollectNodeTree(dom, true);
		}
	}

	var fc = out.firstChild,
	    props = out[ATTR_KEY] || (out[ATTR_KEY] = {}),
	    vchildren = vnode.children;

	// Optimization: fast-path for elements containing a single TextNode:
	if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === 'string' && fc != null && fc.splitText !== undefined && fc.nextSibling == null) {
		if (fc.nodeValue != vchildren[0]) {
			fc.nodeValue = vchildren[0];
		}
	}
	// otherwise, if there are existing or new children, diff them:
	else if (vchildren && vchildren.length || fc != null) {
			innerDiffNode(out, vchildren, context, mountAll, hydrating || props.dangerouslySetInnerHTML != null);
		}

	// Apply attributes/props from VNode to the DOM Element:
	diffAttributes(out, vnode.attributes, props);

	// restore previous SVG mode: (in case we're exiting an SVG namespace)
	isSvgMode = prevSvgMode;

	return out;
}

/** Apply child and attribute changes between a VNode and a DOM Node to the DOM.
 *	@param {Element} dom			Element whose children should be compared & mutated
 *	@param {Array} vchildren		Array of VNodes to compare to `dom.childNodes`
 *	@param {Object} context			Implicitly descendant context object (from most recent `getChildContext()`)
 *	@param {Boolean} mountAll
 *	@param {Boolean} isHydrating	If `true`, consumes externally created elements similar to hydration
 */
function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
	var originalChildren = dom.childNodes,
	    children = [],
	    keyed = {},
	    keyedLen = 0,
	    min = 0,
	    len = originalChildren.length,
	    childrenLen = 0,
	    vlen = vchildren ? vchildren.length : 0,
	    j = void 0,
	    c = void 0,
	    vchild = void 0,
	    child = void 0;

	// Build up a map of keyed children and an Array of unkeyed children:
	if (len !== 0) {
		for (var i = 0; i < len; i++) {
			var _child = originalChildren[i],
			    props = _child[ATTR_KEY],
			    key = vlen && props ? _child._component ? _child._component.__key : props.key : null;
			if (key != null) {
				keyedLen++;
				keyed[key] = _child;
			} else if (props || (_child.splitText !== undefined ? isHydrating ? _child.nodeValue.trim() : true : isHydrating)) {
				children[childrenLen++] = _child;
			}
		}
	}

	if (vlen !== 0) {
		for (var _i = 0; _i < vlen; _i++) {
			vchild = vchildren[_i];
			child = null;

			// attempt to find a node based on key matching
			var _key = vchild.key;
			if (_key != null) {
				if (keyedLen && keyed[_key] !== undefined) {
					child = keyed[_key];
					keyed[_key] = undefined;
					keyedLen--;
				}
			}
			// attempt to pluck a node of the same type from the existing children
			else if (!child && min < childrenLen) {
					for (j = min; j < childrenLen; j++) {
						if (children[j] !== undefined && isSameNodeType(c = children[j], vchild, isHydrating)) {
							child = c;
							children[j] = undefined;
							if (j === childrenLen - 1) childrenLen--;
							if (j === min) min++;
							break;
						}
					}
				}

			// morph the matched/found/created DOM child to match vchild (deep)
			child = idiff(child, vchild, context, mountAll);

			if (child && child !== dom) {
				if (_i >= len) {
					dom.appendChild(child);
				} else if (child !== originalChildren[_i]) {
					if (child === originalChildren[_i + 1]) {
						removeNode(originalChildren[_i]);
					} else {
						dom.insertBefore(child, originalChildren[_i] || null);
					}
				}
			}
		}
	}

	// remove unused keyed children:
	if (keyedLen) {
		for (var _i2 in keyed) {
			if (keyed[_i2] !== undefined) recollectNodeTree(keyed[_i2], false);
		}
	}

	// remove orphaned unkeyed children:
	while (min <= childrenLen) {
		if ((child = children[childrenLen--]) !== undefined) recollectNodeTree(child, false);
	}
}

/** Recursively recycle (or just unmount) a node an its descendants.
 *	@param {Node} node						DOM node to start unmount/removal from
 *	@param {Boolean} [unmountOnly=false]	If `true`, only triggers unmount lifecycle, skips removal
 */
function recollectNodeTree(node, unmountOnly) {
	var component = node._component;
	if (component) {
		// if node is owned by a Component, unmount that component (ends up recursing back here)
		unmountComponent(component);
	} else {
		// If the node's VNode had a ref function, invoke it with null here.
		// (this is part of the React spec, and smart for unsetting references)
		if (node[ATTR_KEY] != null && node[ATTR_KEY].ref) node[ATTR_KEY].ref(null);

		if (unmountOnly === false || node[ATTR_KEY] == null) {
			removeNode(node);
		}

		removeChildren(node);
	}
}

/** Recollect/unmount all children.
 *	- we use .lastChild here because it causes less reflow than .firstChild
 *	- it's also cheaper than accessing the .childNodes Live NodeList
 */
function removeChildren(node) {
	node = node.lastChild;
	while (node) {
		var next = node.previousSibling;
		recollectNodeTree(node, true);
		node = next;
	}
}

/** Apply differences in attributes from a VNode to the given DOM Element.
 *	@param {Element} dom		Element with attributes to diff `attrs` against
 *	@param {Object} attrs		The desired end-state key-value attribute pairs
 *	@param {Object} old			Current/previous attributes (from previous VNode or element's prop cache)
 */
function diffAttributes(dom, attrs, old) {
	var name = void 0;

	// remove attributes no longer present on the vnode by setting them to undefined
	for (name in old) {
		if (!(attrs && attrs[name] != null) && old[name] != null) {
			setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
		}
	}

	// add new & update changed attributes
	for (name in attrs) {
		if (name !== 'children' && name !== 'innerHTML' && (!(name in old) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : old[name]))) {
			setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
		}
	}
}

/** Retains a pool of Components for re-use, keyed on component name.
 *	Note: since component names are not unique or even necessarily available, these are primarily a form of sharding.
 *	@private
 */
var components = {};

/** Reclaim a component for later re-use by the recycler. */
function collectComponent(component) {
	var name = component.constructor.name;
	(components[name] || (components[name] = [])).push(component);
}

/** Create a component. Normalizes differences between PFC's and classful Components. */
function createComponent(Ctor, props, context) {
	var list = components[Ctor.name],
	    inst = void 0;

	if (Ctor.prototype && Ctor.prototype.render) {
		inst = new Ctor(props, context);
		Component.call(inst, props, context);
	} else {
		inst = new Component(props, context);
		inst.constructor = Ctor;
		inst.render = doRender;
	}

	if (list) {
		for (var i = list.length; i--;) {
			if (list[i].constructor === Ctor) {
				inst.nextBase = list[i].nextBase;
				list.splice(i, 1);
				break;
			}
		}
	}
	return inst;
}

/** The `.render()` method for a PFC backing instance. */
function doRender(props, state, context) {
	return this.constructor(props, context);
}

/** Set a component's `props` (generally derived from JSX attributes).
 *	@param {Object} props
 *	@param {Object} [opts]
 *	@param {boolean} [opts.renderSync=false]	If `true` and {@link options.syncComponentUpdates} is `true`, triggers synchronous rendering.
 *	@param {boolean} [opts.render=true]			If `false`, no render will be triggered.
 */
function setComponentProps(component, props, opts, context, mountAll) {
	if (component._disable) return;
	component._disable = true;

	if (component.__ref = props.ref) delete props.ref;
	if (component.__key = props.key) delete props.key;

	if (!component.base || mountAll) {
		if (component.componentWillMount) component.componentWillMount();
	} else if (component.componentWillReceiveProps) {
		component.componentWillReceiveProps(props, context);
	}

	if (context && context !== component.context) {
		if (!component.prevContext) component.prevContext = component.context;
		component.context = context;
	}

	if (!component.prevProps) component.prevProps = component.props;
	component.props = props;

	component._disable = false;

	if (opts !== NO_RENDER) {
		if (opts === SYNC_RENDER || options.syncComponentUpdates !== false || !component.base) {
			renderComponent(component, SYNC_RENDER, mountAll);
		} else {
			enqueueRender(component);
		}
	}

	if (component.__ref) component.__ref(component);
}

/** Render a Component, triggering necessary lifecycle events and taking High-Order Components into account.
 *	@param {Component} component
 *	@param {Object} [opts]
 *	@param {boolean} [opts.build=false]		If `true`, component will build and store a DOM node if not already associated with one.
 *	@private
 */
function renderComponent(component, opts, mountAll, isChild) {
	if (component._disable) return;

	var props = component.props,
	    state = component.state,
	    context = component.context,
	    previousProps = component.prevProps || props,
	    previousState = component.prevState || state,
	    previousContext = component.prevContext || context,
	    isUpdate = component.base,
	    nextBase = component.nextBase,
	    initialBase = isUpdate || nextBase,
	    initialChildComponent = component._component,
	    skip = false,
	    rendered = void 0,
	    inst = void 0,
	    cbase = void 0;

	// if updating
	if (isUpdate) {
		component.props = previousProps;
		component.state = previousState;
		component.context = previousContext;
		if (opts !== FORCE_RENDER && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false) {
			skip = true;
		} else if (component.componentWillUpdate) {
			component.componentWillUpdate(props, state, context);
		}
		component.props = props;
		component.state = state;
		component.context = context;
	}

	component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
	component._dirty = false;

	if (!skip) {
		rendered = component.render(props, state, context);

		// context to pass to the child, can be updated via (grand-)parent component
		if (component.getChildContext) {
			context = extend(extend({}, context), component.getChildContext());
		}

		var childComponent = rendered && rendered.nodeName,
		    toUnmount = void 0,
		    base = void 0;

		if (typeof childComponent === 'function') {
			// set up high order component link

			var childProps = getNodeProps(rendered);
			inst = initialChildComponent;

			if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
				setComponentProps(inst, childProps, SYNC_RENDER, context, false);
			} else {
				toUnmount = inst;

				component._component = inst = createComponent(childComponent, childProps, context);
				inst.nextBase = inst.nextBase || nextBase;
				inst._parentComponent = component;
				setComponentProps(inst, childProps, NO_RENDER, context, false);
				renderComponent(inst, SYNC_RENDER, mountAll, true);
			}

			base = inst.base;
		} else {
			cbase = initialBase;

			// destroy high order component link
			toUnmount = initialChildComponent;
			if (toUnmount) {
				cbase = component._component = null;
			}

			if (initialBase || opts === SYNC_RENDER) {
				if (cbase) cbase._component = null;
				base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
			}
		}

		if (initialBase && base !== initialBase && inst !== initialChildComponent) {
			var baseParent = initialBase.parentNode;
			if (baseParent && base !== baseParent) {
				baseParent.replaceChild(base, initialBase);

				if (!toUnmount) {
					initialBase._component = null;
					recollectNodeTree(initialBase, false);
				}
			}
		}

		if (toUnmount) {
			unmountComponent(toUnmount);
		}

		component.base = base;
		if (base && !isChild) {
			var componentRef = component,
			    t = component;
			while (t = t._parentComponent) {
				(componentRef = t).base = base;
			}
			base._component = componentRef;
			base._componentConstructor = componentRef.constructor;
		}
	}

	if (!isUpdate || mountAll) {
		mounts.unshift(component);
	} else if (!skip) {
		// Ensure that pending componentDidMount() hooks of child components
		// are called before the componentDidUpdate() hook in the parent.
		flushMounts();

		if (component.componentDidUpdate) {
			component.componentDidUpdate(previousProps, previousState, previousContext);
		}
		if (options.afterUpdate) options.afterUpdate(component);
	}

	if (component._renderCallbacks != null) {
		while (component._renderCallbacks.length) {
			component._renderCallbacks.pop().call(component);
		}
	}

	if (!diffLevel && !isChild) flushMounts();
}

/** Apply the Component referenced by a VNode to the DOM.
 *	@param {Element} dom	The DOM node to mutate
 *	@param {VNode} vnode	A Component-referencing VNode
 *	@returns {Element} dom	The created/mutated element
 *	@private
 */
function buildComponentFromVNode(dom, vnode, context, mountAll) {
	var c = dom && dom._component,
	    originalComponent = c,
	    oldDom = dom,
	    isDirectOwner = c && dom._componentConstructor === vnode.nodeName,
	    isOwner = isDirectOwner,
	    props = getNodeProps(vnode);
	while (c && !isOwner && (c = c._parentComponent)) {
		isOwner = c.constructor === vnode.nodeName;
	}

	if (c && isOwner && (!mountAll || c._component)) {
		setComponentProps(c, props, ASYNC_RENDER, context, mountAll);
		dom = c.base;
	} else {
		if (originalComponent && !isDirectOwner) {
			unmountComponent(originalComponent);
			dom = oldDom = null;
		}

		c = createComponent(vnode.nodeName, props, context);
		if (dom && !c.nextBase) {
			c.nextBase = dom;
			// passing dom/oldDom as nextBase will recycle it if unused, so bypass recycling on L229:
			oldDom = null;
		}
		setComponentProps(c, props, SYNC_RENDER, context, mountAll);
		dom = c.base;

		if (oldDom && dom !== oldDom) {
			oldDom._component = null;
			recollectNodeTree(oldDom, false);
		}
	}

	return dom;
}

/** Remove a component from the DOM and recycle it.
 *	@param {Component} component	The Component instance to unmount
 *	@private
 */
function unmountComponent(component) {
	if (options.beforeUnmount) options.beforeUnmount(component);

	var base = component.base;

	component._disable = true;

	if (component.componentWillUnmount) component.componentWillUnmount();

	component.base = null;

	// recursively tear down & recollect high-order component children:
	var inner = component._component;
	if (inner) {
		unmountComponent(inner);
	} else if (base) {
		if (base[ATTR_KEY] && base[ATTR_KEY].ref) base[ATTR_KEY].ref(null);

		component.nextBase = base;

		removeNode(base);
		collectComponent(component);

		removeChildren(base);
	}

	if (component.__ref) component.__ref(null);
}

/** Base Component class.
 *	Provides `setState()` and `forceUpdate()`, which trigger rendering.
 *	@public
 *
 *	@example
 *	class MyFoo extends Component {
 *		render(props, state) {
 *			return <div />;
 *		}
 *	}
 */
function Component(props, context) {
	this._dirty = true;

	/** @public
  *	@type {object}
  */
	this.context = context;

	/** @public
  *	@type {object}
  */
	this.props = props;

	/** @public
  *	@type {object}
  */
	this.state = this.state || {};
}

extend(Component.prototype, {

	/** Returns a `boolean` indicating if the component should re-render when receiving the given `props` and `state`.
  *	@param {object} nextProps
  *	@param {object} nextState
  *	@param {object} nextContext
  *	@returns {Boolean} should the component re-render
  *	@name shouldComponentUpdate
  *	@function
  */

	/** Update component state by copying properties from `state` to `this.state`.
  *	@param {object} state		A hash of state properties to update with new values
  *	@param {function} callback	A function to be called once component state is updated
  */
	setState: function setState(state, callback) {
		var s = this.state;
		if (!this.prevState) this.prevState = extend({}, s);
		extend(s, typeof state === 'function' ? state(s, this.props) : state);
		if (callback) (this._renderCallbacks = this._renderCallbacks || []).push(callback);
		enqueueRender(this);
	},


	/** Immediately perform a synchronous re-render of the component.
  *	@param {function} callback		A function to be called after component is re-rendered.
  *	@private
  */
	forceUpdate: function forceUpdate(callback) {
		if (callback) (this._renderCallbacks = this._renderCallbacks || []).push(callback);
		renderComponent(this, FORCE_RENDER);
	},


	/** Accepts `props` and `state`, and returns a new Virtual DOM tree to build.
  *	Virtual DOM is generally constructed via [JSX](http://jasonformat.com/wtf-is-jsx).
  *	@param {object} props		Props (eg: JSX attributes) received from parent element/component
  *	@param {object} state		The component's current state
  *	@param {object} context		Context object (if a parent component has provided context)
  *	@returns VNode
  */
	render: function render() {}
});

/** Render JSX into a `parent` Element.
 *	@param {VNode} vnode		A (JSX) VNode to render
 *	@param {Element} parent		DOM element to render into
 *	@param {Element} [merge]	Attempt to re-use an existing DOM tree rooted at `merge`
 *	@public
 *
 *	@example
 *	// render a div into <body>:
 *	render(<div id="hello">hello!</div>, document.body);
 *
 *	@example
 *	// render a "Thing" component into #foo:
 *	const Thing = ({ name }) => <span>{ name }</span>;
 *	render(<Thing name="one" />, document.querySelector('#foo'));
 */
function render(vnode, parent, merge) {
  return diff(merge, vnode, {}, false, parent, false);
}

var React = {
	h: h,
	createElement: h,
	cloneElement: cloneElement,
	Component: Component,
	render: render,
	rerender: rerender,
	options: options
};

var pageHeading = "Connectivity Issues!";
var pagePath = "/offline/";
var innerHTML = "<p class=\"p--large\"><strong>Uh-oh!</strong> You may be offline… <span style=\"font-family:sans-serif;\" role=\"presentation\">(-_-)ゞ</span></p>\n\n<p>Or maybe my server just evaporated? Refresh, try again later, file complaints with <a href=\"http://twitter.com/dbushell\">@dbushell</a> if symptoms persist.</p>\n";
var pageTitle = "Connectivity Issues! – David Bushell – Web Design (UK)";
var offlinePageProps = {
	pageHeading: pageHeading,
	pagePath: pagePath,
	innerHTML: innerHTML,
	pageTitle: pageTitle
};

var Block = function Block(props) {
  if (props.isMain) {
    return React.h(
      'main',
      { className: ['c-main'].concat(props.classList).join(' ').trim() },
      props.children
    );
  }
  return React.h(
    'div',
    { className: ['b-block'].concat(props.classList).join(' ').trim() },
    props.children
  );
};

var imageSrc = "/assets/img/me3@1x.jpg";
var imageSrcset = "/assets/img/me3@1x.jpg 1x, /assets/img/me3@2x.jpg 2x";
var imageAlt = "David Bushell";
var title = "David Bushell";
var href = "/about/";
var text = "Based in the UK, near Manchester, I freelance for small businesses, start-ups, individuals, and fellow web agencies — all over the world.";
var defaults$1 = {
	imageSrc: imageSrc,
	imageSrcset: imageSrcset,
	imageAlt: imageAlt,
	title: title,
	href: href,
	text: text
};

var Bio = function Bio(props) {
  var attr = {
    className: 'b-bio',
    role: 'complementary',
    itemScope: true,
    itemType: 'http://schema.org/Person'
  };
  return React.h(
    'section',
    attr,
    React.h(
      'div',
      { className: 'b-bio__image' },
      React.h('img', {
        src: props.imageSrc,
        srcSet: props.imageSrcset,
        alt: props.imageAlt
      })
    ),
    React.h(
      'div',
      { className: 'b-bio__main' },
      React.h(
        'h3',
        { itemProp: 'name' },
        React.h(
          'a',
          { href: props.href },
          props.title
        )
      ),
      React.h(
        'p',
        { itemProp: 'description' },
        props.text
      )
    )
  );
};
Bio.defaultProps = defaults$1;

var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var abbrMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var Time = function Time(props) {
  var date = new Date(props.date);
  var attr = {
    className: 'time',
    dateTime: date.toISOString()
  };
  var time = {
    dddd: days[date.getDay()],
    D: date.getDate(),
    MMMM: months[date.getMonth()],
    MMM: abbrMonths[date.getMonth()],
    Y: date.getFullYear()
  };
  return React.h(
    'time',
    attr,
    time.dddd,
    ' ',
    React.h(
      'b',
      null,
      time.D,
      ' ',
      React.h(
        'abbr',
        { title: time.MMMM },
        time.MMM
      ),
      ' ',
      time.Y
    )
  );
};

var BlogItem = function BlogItem(props) {
  return React.h(
    'li',
    { className: 'b-blog__item' },
    React.h(
      'a',
      { rel: 'bookmark', href: props.href },
      props.title
    ),
    React.h(Time, { date: props.date })
  );
};
var Blog = function Blog(props) {
  var attr = {
    className: 'b-blog',
    role: 'navigation'
  };
  return React.h(
    'aside',
    attr,
    React.h(
      'div',
      { className: 'b-blog__title' },
      React.h(
        'h3',
        null,
        props.heading
      )
    ),
    React.h(
      'ul',
      { className: 'b-blog__list' },
      props.items.map(function (item) {
        return React.h(BlogItem, _extends({ key: item.id }, item));
      })
    )
  );
};

var Small = function Small(props) {
  return React.h(
    'p',
    null,
    React.h(
      'small',
      null,
      props.children
    )
  );
};

var heading = "From the blog…";
var items$1 = [{ "id": "typescript-instead-of-react-proptypes", "title": "TypeScript over React PropTypes", "href": "/2017/04/19/typescript-instead-of-react-proptypes/", "date": 1492596000000 }, { "id": "the-magic-of-service-workers", "title": "The Magic of Service Workers", "href": "/2017/04/06/the-magic-of-service-workers/", "date": 1491472800000 }, { "id": "i-watched-iron-fist-and-coded-css", "title": "I watched Iron Fist and coded CSS 👈", "href": "/2017/04/03/i-watched-iron-fist-and-coded-css/", "date": 1491213600000 }, { "id": "web-security-and-cloudflare", "title": "Web Security and Cloudflare", "href": "/2017/02/17/web-security-and-cloudflare/", "date": 1487325600000 }, { "id": "react-as-a-static-site-generator", "title": "React as a Static Site Generator", "href": "/2017/02/13/react-as-a-static-site-generator/", "date": 1486980000000 }, { "id": "resolving-javascript-promises-sequentially-without-nesting", "title": "Working with Promises", "href": "/2016/12/16/resolving-javascript-promises-sequentially-without-nesting/", "date": 1481882400000 }];
var blogProps$1 = {
	heading: heading,
	items: items$1
};

// Read props live for static site generation to avoid require cache
function blogProps() {
  return blogProps$1;
}
var Footer = function Footer(props) {
  var attr = {
    id: 'footer',
    className: 'c-footer u-dim'
  };
  var hire = React.h(
    'a',
    { href: '/contact/', className: 'b-hire' },
    React.h('img', {
      className: 'b-hire__image',
      src: '/assets/img/dbushell-for-hire.svg',
      alt: 'Available for Hire'
    })
  );
  return React.h(
    'footer',
    attr,
    React.h(
      Block,
      null,
      React.h(Bio, null),
      props.isHirable ? hire : React.h('hr', null),
      React.h(Blog, blogProps()),
      React.h('hr', null),
      React.h(
        Small,
        null,
        'Copyright \xA9 ',
        new Date().getFullYear(),
        ' ',
        React.h(
          'a',
          { href: '/' },
          'David Bushell'
        )
      )
    )
  );
};
Footer.defaultProps = {
  isHirable: true
};

var Icon = function Icon(props) {
  var icon = function icon(id) {
    return { __html: '<use xlink:href="/assets/img/icons.svg#' + id + '"></use>' };
  };
  var attr = {
    role: 'presentation'
  };
  return React.h('svg', _extends({}, attr, { dangerouslySetInnerHTML: icon(props.id) }));
};

var heading$1 = "Website Navigation";
var items$2 = [{ "order": 1, "priority": 1, "text": "Home", "href": "/" }, { "order": 2, "priority": 4, "text": "About", "href": "/about/" }, { "order": 3, "priority": 2, "text": "Services", "href": "/services/" }, { "order": 4, "priority": 5, "text": "Portfolio", "href": "/showcase/" }, { "order": 5, "priority": 6, "text": "Blog", "href": "/blog/" }, { "order": 6, "priority": 3, "text": "Contact", "href": "/contact/" }];
var defaults$2 = {
	heading: heading$1,
	items: items$2
};

var NavItem = function NavItem(props) {
  return React.h(
    'li',
    {
      className: 'b-nav__item',
      'data-priority': props.priority,
      'data-order': props.order },
    React.h(
      'a',
      { href: props.href, className: 'b-nav__link' },
      props.text
    )
  );
};
var Nav = function Nav(props) {
  return React.h(
    'nav',
    { className: 'b-nav', id: 'nav' },
    React.h(
      'h2',
      { className: 'b-nav__title u-vh' },
      props.heading
    ),
    React.h(
      'ul',
      { className: 'b-nav__list', 'data-root': 'true' },
      props.items.map(function (item) {
        return React.h(NavItem, _extends({ key: item.order }, item));
      }),
      React.h(
        'li',
        {
          className: 'b-nav__item b-nav__item--icons',
          'data-priority': props.items.length + 1,
          'data-order': props.items.length + 1 },
        React.h(
          'a',
          {
            className: 'b-nav__link',
            rel: 'me noopener noreferrer',
            target: '_blank',
            title: 'David Bushell on Twitter',
            href: 'http://twitter.com/dbushell' },
          React.h(Icon, { id: 'twitter' }),
          React.h(
            'span',
            { className: 'u-vh' },
            '@dbushell'
          )
        ),
        React.h(
          'a',
          {
            className: 'b-nav__link',
            rel: 'me noopener noreferrer',
            target: '_blank',
            title: 'David Bushell on GitHub',
            href: 'https://github.com/dbushell/' },
          React.h(Icon, { id: 'github' }),
          React.h(
            'span',
            { className: 'u-vh' },
            'GitHub'
          )
        ),
        React.h(
          'a',
          {
            className: 'b-nav__link',
            rel: 'me noopener noreferrer',
            target: '_blank',
            title: 'David Bushell on CodePen',
            href: 'http://codepen.io/dbushell/' },
          React.h(Icon, { id: 'codepen' }),
          React.h(
            'span',
            { className: 'u-vh' },
            'CodePen'
          )
        )
      )
    ),
    React.h(
      'div',
      { className: 'b-nav__more' },
      React.h(
        'button',
        { type: 'button', className: 'b-nav__link' },
        React.h(Icon, { id: 'nav' })
      ),
      React.h('ul', { className: 'b-nav__dropdown' })
    )
  );
};
Nav.defaultProps = defaults$2;

var ButtonLabel = function ButtonLabel(props) {
  return React.h(
    'span',
    { className: 'e-button__label' },
    props.text
  );
};
var Button = function Button(props) {
  var attr = {
    className: 'e-button'
  };
  if (props.bg1) {
    attr.className += ' e-button--bg1';
  }
  if (props.bg2) {
    attr.className += ' e-button--bg2';
  }
  if (props.shadow) {
    attr.className += ' e-button--shadow';
  }
  var label = React.h(ButtonLabel, { text: props.text });
  var button = void 0;
  if (props.submit) {
    button = React.h(
      'button',
      _extends({ type: 'submit' }, attr),
      label
    );
  } else {
    button = React.h(
      'a',
      _extends({ href: props.href }, attr),
      label
    );
  }
  return button;
};
Button.defaultProps = {
  text: 'Button'
};

var Excerpt = function Excerpt(props) {
  var attr = {
    className: 'b-post b-post--excerpt'
  };
  var body = function body() {
    return { __html: props.body };
  };
  return React.h(
    'article',
    attr,
    React.h(
      'h3',
      { className: 'b-post__title' },
      React.h(
        'a',
        { href: props.href },
        props.title
      )
    ),
    React.h(
      'p',
      { className: 'b-post__date' },
      React.h(Time, { date: props.date })
    ),
    React.h(
      'div',
      { className: 'b-post__body' },
      React.h('p', { dangerouslySetInnerHTML: body() })
    )
  );
};

var Post = function Post(props) {
  var classList = ['b-post'].concat(props.classList);
  return React.h(
    'div',
    { className: classList.join(' ').trim() },
    props.children
  );
};

var Archive = function Archive(props) {
  var nextButton = props.nextPage ? React.h(Button, { href: props.nextPage, text: 'Older' }) : null;
  var prevButton = props.prevPage ? React.h(Button, { href: props.prevPage, text: 'Newer' }) : null;
  var pagination = nextButton || prevButton ? React.h(
    'div',
    { className: 'b-pagination' },
    nextButton,
    prevButton
  ) : null;
  var items = [];
  props.excerpts.forEach(function (item) {
    items.push(React.h(Excerpt, _extends({ key: item.id }, item)));
    items.push(React.h('hr', { key: item.id + '-hr' }));
  });
  return React.h(
    Block,
    { isMain: true },
    React.h(
      Block,
      null,
      React.h(
        Post,
        null,
        React.h(
          'div',
          { className: 'b-post__title' },
          React.h(
            'h1',
            null,
            props.pageHeading
          )
        ),
        React.h(
          'div',
          { className: 'b-post__body' },
          items
        ),
        pagination
      )
    )
  );
};
Archive.defaultProps = {
  pageHeading: 'Blog'
};

var title$1 = "Get a free quote…";
var paragraph = "Interested in working with me? <a href=\"/contact/\">Send me an email</a> with your requirements and I’ll happily provide a free quote and let you know my availability.";
var link = "Get in touch";
var href$1 = "/contact/";
var defaults$3 = {
	title: title$1,
	paragraph: paragraph,
	link: link,
	href: href$1
};

var Cta = function Cta(props) {
  var paragraph$$1 = function paragraph$$1() {
    return {
      __html: props.paragraph
    };
  };
  return React.h(
    'div',
    { className: 'b-boxed b-boxed--dark u-dark' },
    React.h(
      'h3',
      null,
      props.title
    ),
    React.h('p', { dangerouslySetInnerHTML: paragraph$$1() }),
    React.h(Button, { bg1: true, href: props.href, text: props.link })
  );
};
Cta.defaultProps = defaults$3;

var Field = function Field(props) {
  var attr = {
    className: 'e-field'
  };
  return React.h('input', _extends({}, attr, props));
};
Field.defaultProps = {
  id: 'field',
  required: true
};

var Label = function Label(props) {
  var attr = {
    className: 'e-label',
    htmlFor: props.field
  };
  return React.h(
    'label',
    attr,
    props.text
  );
};

var Newsletter = function Newsletter() {
  return React.h(
    'aside',
    { className: 'b-newsletter', role: 'complementary' },
    React.h(
      'div',
      { className: 'b-boxed b-boxed--light' },
      React.h(
        'div',
        { className: 'b-newsletter__header' },
        React.h(
          'h4',
          null,
          'Side projects newsletter'
        ),
        React.h(
          'p',
          { className: 'p--small' },
          'Every now and then I release something cool, be the first to know!'
        )
      ),
      React.h(
        'form',
        {
          noValidate: true,
          className: 'b-form',
          id: 'newsletter',
          action: '//dbushell.us1.list-manage.com/subscribe/post?u=f1621b8d47b205bc9a898c68f&id=84a4c62ca9',
          method: 'post',
          name: 'mc-embedded-subscribe-form',
          target: '_blank' },
        React.h(
          'div',
          { className: 'b-form__item' },
          React.h(Label, { field: 'mce-EMAIL', text: 'Email Address' }),
          React.h(Field, {
            type: 'email',
            name: 'EMAIL',
            id: 'mce-EMAIL',
            placeholder: 'me@example.com\u2026'
          })
        ),
        React.h(
          'div',
          { className: 'b-form__item' },
          React.h(Label, { text: 'Email Format:' }),
          React.h(
            'label',
            { htmlFor: 'mce-EMAILTYPE-0', className: 'e-label e-label--radio' },
            React.h('input', {
              defaultChecked: true,
              className: 'u-vh',
              type: 'radio',
              value: 'html',
              name: 'EMAILTYPE',
              id: 'mce-EMAILTYPE-0'
            }),
            React.h(
              'span',
              null,
              'HTML'
            )
          ),
          React.h(
            'label',
            { htmlFor: 'mce-EMAILTYPE-1', className: 'e-label e-label--radio' },
            React.h('input', {
              className: 'u-vh',
              type: 'radio',
              value: 'text',
              name: 'EMAILTYPE',
              id: 'mce-EMAILTYPE-1'
            }),
            React.h(
              'span',
              null,
              'Text'
            )
          )
        ),
        React.h(
          'div',
          { className: 'b-form__item' },
          React.h(
            'div',
            { className: 'u-vh', 'aria-hidden': 'true' },
            React.h('input', {
              type: 'text',
              name: 'b_f1621b8d47b205bc9a898c68f_84a4c62ca9',
              value: ''
            })
          ),
          React.h(Button, { submit: true, text: 'Subscribe', name: 'subscribe' })
        )
      )
    )
  );
};

// Utilities for all environments

/**
 * Handlebars `escapeExpression` function:
 * https://github.com/wycats/handlebars.js/blob/7535e48a7969229f44489124a8ef07bd17363f06/lib/handlebars/utils.js
 */

var chars = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;',
  '=': '&#x3D;'
};
var esc = function esc(str) {
  return str.replace(/[&<>"'`=]/g, function (chr) {
    return chars[chr];
  });
};

/**
 * Marked `smartypants` function:
 * https://github.com/chjj/marked/blob/8f9d0b72f5606ed32057049f387161dd41c36ade/lib/marked.js#L715
 */


/**
 * Trim page excerpt.
 */


/**
 * Format page heading to avoid widows on larger viewports.
 */
function formatHeading(title) {
  var words = title.split(' ');
  if (words.length > 3 && words[words.length - 1].length < 9) {
    var pos = title.lastIndexOf(' ');
    title = esc(title.substr(0, pos)) + '<span class="nbsp">&nbsp;</span>' + esc(title.substr(pos + 1));
  } else {
    title = esc(title);
  }
  return title;
}

/**
 * Remove private properties from an object.
 */

var Article = function Article(props) {
  var title = function title() {
    return { __html: formatHeading(props.pageHeading) };
  };
  var body = function body() {
    return { __html: props.innerHTML };
  };
  var date = function date() {
    if (!props.pageUndated) {
      return React.h(
        'p',
        { className: 'b-post__date' },
        React.h(Time, { date: props.dateUnix })
      );
    }
  };
  var ctaProps = {
    title: 'More from me…',
    link: 'Why not hire me!',
    paragraph: '<a href="/blog/">Read more on my blog</a> and follow <a rel="me noopener noreferrer" target="_blank" href="http://twitter.com/dbushell" title="David Bushell on Twitter">@dbushell</a>. If you like what I do:'
  };
  return React.h(
    Block,
    { isMain: true },
    React.h(
      Block,
      null,
      React.h(
        Post,
        null,
        React.h('h1', { className: 'b-post__title', dangerouslySetInnerHTML: title() }),
        date(),
        React.h('div', { className: 'b-post__body', dangerouslySetInnerHTML: body() })
      ),
      React.h('hr', null),
      React.h(Cta, ctaProps),
      React.h(Newsletter, null)
    )
  );
};
Article.defaultProps = {
  pageHeading: 'Untitled',
  dateUnix: Date.now()
};

var contactScript = '\nvar href = window.location.href;\nvar form = document.getElementById(\'contact-form\');\nvar para = document.createElement(\'p\');\nif (href.indexOf(\'?success=true\') !== -1) {\n  para.innerHTML = \'<hr><strong>Thank you for your enquiry, I\u2019ll reply as soon as possible.</strong>\';\n  form.style.cssText = \'display: none;\';\n}\nif (href.indexOf(\'?error=true\') !== -1) {\n  para.className = \'u-error\';\n  para.innerHTML = \'<strong>There was an error submitting your enquiry, please email <a href="mailto:hi@dbushell.com">hi@dbushell.com</a></strong>\';\n}\nif (href.indexOf(\'?error=empty\') !== -1) {\n  para.className = \'u-error\';\n  para.innerHTML = \'<strong>Please enter your name, email address, and enquiry.</strong>\';\n}\nif (href.indexOf(\'?error=email\') !== -1) {\n  para.className = \'u-error\';\n  para.innerHTML = \'<strong>Please enter a valid email address.</strong>\';\n}\nif (para.innerHTML.length > 0) {\n  form.parentNode.insertBefore(para, form);\n}\n';
var Contact = function Contact(props) {
  return React.h(
    Block,
    { isMain: true },
    React.h(
      Block,
      null,
      React.h(
        Post,
        null,
        React.h(
          'div',
          { className: 'b-post__title' },
          React.h(
            'h1',
            null,
            props.pageHeading
          )
        ),
        React.h(
          'div',
          { className: 'b-post__body' },
          React.h(
            'p',
            null,
            'Need help with your website?'
          ),
          React.h(
            'p',
            { className: 'p--large' },
            React.h(
              'b',
              null,
              React.h(
                'a',
                { href: 'mailto:hi@dbushell.com' },
                'hi@dbushell.com'
              )
            )
          ),
          React.h(
            'p',
            null,
            'or use the form below:'
          ),
          React.h(
            'form',
            {
              className: 'b-form',
              id: 'contact-form',
              method: 'post',
              action: 'https://formspree.io/hi@dbushell.com' },
            React.h('input', {
              type: 'hidden',
              name: '_next',
              value: 'http://dbushell.com/contact/?success=true'
            }),
            React.h('input', {
              type: 'hidden',
              name: '_subject',
              value: 'dbushell.com enquiry'
            }),
            React.h(
              'ul',
              { className: 'b-form__list' },
              React.h(
                'li',
                { className: 'b-form__item' },
                React.h(Label, { field: 'contact-name', text: 'Name' }),
                React.h(Field, { id: 'contact-name', name: 'name' })
              ),
              React.h(
                'li',
                { className: 'b-form__item' },
                React.h(Label, { field: 'contact-email', text: 'Email Address' }),
                React.h(Field, {
                  type: 'email',
                  id: 'contact-email',
                  name: '_replyto',
                  placeholder: 'me@example.com\u2026'
                })
              ),
              React.h(
                'li',
                { className: 'b-form__item' },
                React.h(
                  'h4',
                  null,
                  React.h(
                    'strong',
                    null,
                    'Have a project in mind?'
                  )
                ),
                React.h(
                  'p',
                  { className: 'p--small' },
                  'I can provide a',
                  ' ',
                  React.h(
                    'b',
                    null,
                    'free quote.'
                  ),
                  ' ',
                  'Please provide as much detail as possible \u2014 budget, requirements, timelines \u2014 so I can answer you quickly. If I\u2019m not available now we can book in advance.'
                ),
                React.h(Label, { field: 'contact-enquiry', text: 'Enquiry' }),
                React.h('textarea', {
                  required: true,
                  className: 'e-field e-field--area',
                  id: 'contact-enquiry',
                  name: 'enquiry',
                  rows: 5
                })
              ),
              React.h(
                'li',
                { className: 'b-form__item u-vh' },
                React.h(Label, {
                  field: 'contact-human',
                  text: 'If you\u2019re human leave the next field blank!'
                }),
                React.h('input', {
                  type: 'text',
                  id: 'contact-human',
                  name: '_gotcha',
                  tabIndex: -1
                })
              ),
              React.h(
                'li',
                { className: 'b-form__item' },
                React.h(Button, { submit: true, text: 'Send Message' })
              )
            )
          ),
          React.h('script', { dangerouslySetInnerHTML: { __html: contactScript } })
        )
      )
    )
  );
};
Contact.defaultProps = {
  pageHeading: 'Contact'
};

var heading$2 = "What my clients say:";
var button = { "href": "/contact/", "text": "Work with me", "bg1": true };
var blockquotes = [{ "id": 1, "quote": "Highly skilled, personable, helpful and dedicated: David exceeded my expectations to deliver for us on a key project.", "cite": "Frank Fenton – Head of Digital – Dinosaur UK Ltd." }, { "id": 2, "quote": "David honestly was the integral component that allowed us to finally launch. We continue to go to him for any development work for our site, because he goes above & beyond what you’d ever expect.", "cite": "Alexandra Adina – SwingVoterz.com" }, { "id": 3, "quote": "David provided us with beautiful and cost effective templates for our CMS that surpassed our high expectations from both the design and the tech perspective.", "cite": "Kevin Mueller – Studio Manager – Uwe Wittwer", "href": "/2014/05/07/responsive-design-for-uwe-wittwer/" }];
var defaults$4 = {
	heading: heading$2,
	button: button,
	blockquotes: blockquotes
};

var ClientsItem = function ClientsItem(props) {
  return React.h(
    'blockquote',
    null,
    React.h(
      'p',
      { className: 'p--large p--quote' },
      props.quote
    ),
    React.h(
      'p',
      { className: 'p--small' },
      React.h(
        'cite',
        null,
        props.href ? React.h(
          'a',
          { href: props.href },
          props.cite
        ) : props.cite
      )
    )
  );
};
var Clients = function Clients(props) {
  return React.h(
    'div',
    { className: 'c-clients u-dark' },
    React.h(
      Block,
      null,
      React.h(
        'div',
        { className: 'c-clients__header' },
        React.h(
          'h2',
          null,
          props.heading
        )
      ),
      props.blockquotes.map(function (item) {
        return React.h(ClientsItem, _extends({ key: item.id }, item));
      }),
      React.h(
        'div',
        { className: 'c-clients__footer' },
        React.h(Button, props.button)
      )
    )
  );
};
Clients.defaultProps = defaults$4;

var heading$3 = "Featured Projects";
var href$2 = "/showcase/";
var items$3 = [{ "bgColor": "#b72817", "href": "/2016/10/10/building-a-shopify-theme/", "heading": "Shopify Theme", "imageSrc": "/assets/img/portfolio/stshopify.png", "imageAlt": "Building a Shopify Theme" }, { "bgColor": "#d8ac59", "href": "/2015/03/18/responsive-design-for-houden/", "heading": "Houden", "imageSrc": "/assets/img/portfolio/houden.png", "imageAlt": "Houden" }, { "bgColor": "#993300", "href": "/2014/05/07/responsive-design-for-uwe-wittwer/", "heading": "Uwe Wittwer", "imageSrc": "/assets/img/portfolio/uwewittwer.png", "imageAlt": "Uwe Wittwer" }];
var defaults$5 = {
	heading: heading$3,
	href: href$2,
	items: items$3
};

var FolioItem = function FolioItem(props) {
  return React.h(
    'li',
    { className: 'b-folio__item', style: { backgroundColor: props.bgColor } },
    React.h(
      'a',
      { className: 'b-folio__link', href: props.href },
      React.h(
        'span',
        { className: 'b-folio__label' },
        props.heading
      ),
      React.h('img', {
        className: 'b-folio__image',
        src: props.imageSrc,
        alt: props.imageAlt
      })
    )
  );
};
var Folio = function Folio(props) {
  return React.h(
    'div',
    { className: 'c-folio' },
    React.h(
      Block,
      null,
      React.h(
        'div',
        { className: 'c-folio__header' },
        React.h(
          'h2',
          null,
          React.h(
            'a',
            { href: props.href },
            props.heading
          )
        )
      ),
      React.h(
        'div',
        { className: 'b-folio' },
        React.h(
          'ul',
          { className: 'b-folio__list' },
          props.items.map(function (item) {
            return React.h(FolioItem, _extends({ key: item.href }, item));
          })
        )
      )
    )
  );
};
Folio.defaultProps = defaults$5;

var Star = function Star(props) {
  var star = function star(id) {
    return { __html: '<use xlink:href="/assets/img/stars.svg#' + id + '"></use>' };
  };
  var attr = {
    className: 'e-star',
    role: 'presentation'
  };
  if (props.blink) {
    attr.className += ' e-star--blink';
  }
  return React.h('svg', _extends({}, attr, { dangerouslySetInnerHTML: star(props.id) }));
};
Star.defaultProps = {
  id: 'star'
};

var heading$4 = "David Bushell – Web Design & Front-end Development (based in Manchester, UK)";
var defaults$6 = {
	heading: heading$4
};

var Hero = function Hero(props) {
  return React.h(
    'header',
    { className: 'c-hero' },
    React.h(
      Block,
      null,
      React.h(
        'div',
        { className: 'c-hero__logo' },
        React.h(
          'h1',
          { className: 'u-vh' },
          props.heading
        ),
        React.h('img', { src: '/assets/img/david-bushell.svg', alt: 'David Bushell' })
      ),
      React.h('div', { className: 'c-hero__burst' }),
      React.h('div', { className: 'c-hero__crane' }),
      React.h(Star, { blink: true, id: 'star' }),
      React.h(Star, { blink: true, id: 'burst' }),
      React.h(Star, { blink: true, id: 'star' })
    ),
    React.h(
      'div',
      { className: 'c-hero__bg' },
      React.h(
        'div',
        null,
        React.h(
          'svg',
          { xmlns: 'http://www.w3.org/2000/svg' },
          React.h('path', { className: 'st0', d: 'M3000 600H0V0z' }),
          React.h('path', { className: 'st1', d: 'M-4.5 2.5l3005 601' }),
          React.h('path', { className: 'st2', d: 'M-4.5 9.5l3005 601' })
        )
      )
    )
  );
};
Hero.defaultProps = defaults$6;

var Sector = function Sector(props) {
  var attr = {
    className: 'b-sector'
  };
  var buttonAttr = Object.assign({}, props.button, {
    bg1: !props.alt,
    bg2: props.alt,
    shadow: true
  });
  if (props.rtl) {
    attr.className += ' b-sector--rtl';
  }
  attr.className += props.alt ? ' u-dark-alt' : ' u-dark';
  var starId = props.alt ? 'right' : 'left';
  return React.h(
    'article',
    attr,
    React.h(Star, { id: starId }),
    React.h(
      'div',
      { className: 'b-sector__header' },
      React.h(
        'h2',
        { className: 'u-bright' },
        props.heading
      ),
      React.h(
        'p',
        { className: 'p--large u-dim' },
        props.subheading
      )
    ),
    React.h(
      'div',
      { className: 'b-sector__main' },
      React.h(
        'p',
        null,
        props.description
      )
    ),
    React.h(Button, buttonAttr)
  );
};

var items$4 = [{ "rtl": true, "alt": true, "heading": "For Businesses", "subheading": "Have an idea?", "description": "Let’s discuss your requirements, share ideas, and figure out what’s best for your new website together.", "button": { "text": "How I can help", "href": "/working-with-clients/" } }, { "heading": "Web Agencies", "subheading": "Need a hand?", "description": "I’m reliable and flexible, priding myself in communication and initiative to ensure smooth delivery.", "button": { "text": "What I can do", "href": "/working-with-agencies/" } }];
var defaults$7 = {
	items: items$4
};

var Sectors = function Sectors(_ref) {
  var items$$1 = _ref.items;

  return React.h(
    'div',
    { className: 'c-sectors' },
    React.h(
      Block,
      null,
      React.h(
        'div',
        { className: 'c-sectors__list' },
        React.h(
          'div',
          { className: 'c-sectors__item' },
          React.h(Sector, items$$1[0])
        ),
        React.h(
          'div',
          { className: 'c-sectors__item' },
          React.h(Sector, items$$1[1])
        )
      )
    )
  );
};
Sectors.defaultProps = defaults$7;

var items$5 = [{ "href": "/responsive-design/", "heading": "Responsive Web Design", "description": "I design websites that work across all devices. They’re fluid and adaptive, just like my process.", "button": { "href": "/contact/", "text": "Hire me!" } }, { "href": "/front-end-development/", "heading": "Front-end Development", "description": "HTML, CSS, & JavaScript - there’s web standards and then there’s browsers, and I know both." }, { "href": "/services/", "heading": "And a whole lot more…", "description": "Be it WordPress, eCommerce, or simply advice, I have a depth of experience to help you." }];
var defaults$8 = {
	items: items$5
};

var StepsItem = function StepsItem(props) {
  return React.h(
    'article',
    { className: 'c-steps__item' },
    React.h(
      'h2',
      { className: 'h4' },
      React.h(
        'a',
        { href: props.href },
        props.heading
      )
    ),
    React.h(
      'p',
      null,
      props.description
    ),
    props.button ? React.h(Button, props.button) : null
  );
};
var Steps = function Steps(props) {
  var items$$1 = [];
  var key = 0;
  var id = function id() {
    return ++key;
  };
  props.items.forEach(function (item, i) {
    items$$1.push(React.h(StepsItem, _extends({ key: id() }, item)));
    if (i < props.items.length - 1) {
      items$$1.push(React.h('hr', { key: id() }));
    }
  });
  return React.h(
    'div',
    { className: 'c-steps' },
    React.h(
      Block,
      null,
      React.h(
        'div',
        { className: 'c-steps__list' },
        items$$1
      )
    )
  );
};
Steps.defaultProps = defaults$8;

var Home = function Home() {
  return React.h(
    Block,
    { isMain: true, classList: ['c-main--home'] },
    React.h(Hero, null),
    React.h(Steps, null),
    React.h(Sectors, null),
    React.h(Folio, null),
    React.h(Clients, null)
  );
};
Home.defaultProps = {
  pageHeading: 'David Bushell – Web Design & Front-end Development (based in Manchester, UK)'
};

var Page = function Page(props) {
  var postBody = props.innerHTML ? React.h('div', {
    className: 'b-post__body',
    dangerouslySetInnerHTML: { __html: props.innerHTML }
  }) : React.h(
    'div',
    { className: 'b-post__body' },
    props.children
  );
  return React.h(
    Block,
    { isMain: true },
    React.h(
      Block,
      null,
      React.h(
        Post,
        null,
        React.h(
          'div',
          { className: 'b-post__title' },
          React.h(
            'h1',
            null,
            props.pageHeading
          )
        ),
        postBody
      )
    )
  );
};
Page.defaultProps = {
  pageHeading: 'Page'
};

var Patterns = function Patterns(props) {
  return React.h(
    Block,
    { isMain: true },
    React.h(
      Block,
      null,
      React.h(
        Post,
        null,
        React.h(
          'div',
          { className: 'b-post__title' },
          React.h(
            'h1',
            null,
            props.pageHeading
          )
        ),
        React.h('hr', null),
        React.h(
          'h2',
          null,
          'Biography'
        ),
        React.h(
          'div',
          { className: 'b-post__pattern' },
          React.h(Bio, null)
        ),
        React.h(
          'h2',
          null,
          'Blog latest'
        ),
        React.h(
          'div',
          { className: 'b-post__pattern' },
          React.h(Blog, blogProps$1)
        ),
        React.h(
          'h2',
          null,
          'Call to Action'
        ),
        React.h(
          'div',
          { className: 'b-post__pattern' },
          React.h(Cta, null)
        ),
        React.h(
          'h2',
          null,
          'Newsletter'
        ),
        React.h(
          'div',
          { className: 'b-post__pattern' },
          React.h(Newsletter, null)
        ),
        React.h(
          'h2',
          null,
          'Sector'
        ),
        React.h(
          'div',
          { className: 'b-post__pattern' },
          React.h(Sector, Sectors.defaultProps.items[1])
        ),
        React.h(
          'h2',
          null,
          'Sector RTL'
        ),
        React.h(
          'div',
          { className: 'b-post__pattern' },
          React.h(Sector, Sectors.defaultProps.items[0])
        )
      )
    )
  );
};
Patterns.defaultProps = {
  pageHeading: 'Pattern Library'
};

var Portfolio = function Portfolio(props) {
  return React.h(
    Block,
    { isMain: true },
    React.h(
      Block,
      null,
      React.h(
        Post,
        null,
        React.h(
          'div',
          { className: 'b-post__title' },
          React.h(
            'h1',
            null,
            props.pageHeading
          )
        ),
        React.h(
          'div',
          { className: 'b-post__body' },
          React.h(
            'p',
            null,
            'Selected web design and front-end development projects.'
          ),
          React.h(
            'div',
            { className: 'b-folio' },
            React.h(
              'ul',
              { className: 'b-folio__list' },
              React.h(
                'li',
                {
                  className: 'b-folio__item',
                  style: { backgroundColor: '#29313d' } },
                React.h(
                  'a',
                  {
                    className: 'b-folio__link',
                    href: '/2016/07/14/building-a-wordpress-theme/' },
                  React.h(
                    'span',
                    { className: 'b-folio__label' },
                    'Base Creative / WordPress'
                  ),
                  React.h('img', {
                    className: 'b-folio__image',
                    src: '/assets/img/portfolio/bcwordpress.png',
                    alt: 'Building a WordPress Theme designed by Base Creative, London'
                  })
                )
              ),
              React.h(
                'li',
                {
                  className: 'b-folio__item',
                  style: { backgroundColor: '#d8ac59' } },
                React.h(
                  'a',
                  {
                    className: 'b-folio__link',
                    href: '/2015/03/18/responsive-design-for-houden/' },
                  React.h(
                    'span',
                    { className: 'b-folio__label' },
                    'Houden'
                  ),
                  React.h('img', {
                    className: 'b-folio__image',
                    src: '/assets/img/portfolio/houden.png',
                    alt: 'Houden'
                  })
                )
              ),
              React.h(
                'li',
                {
                  className: 'b-folio__item',
                  style: { backgroundColor: '#993300' } },
                React.h(
                  'a',
                  {
                    className: 'b-folio__link',
                    href: '/2014/05/07/responsive-design-for-uwe-wittwer/' },
                  React.h(
                    'span',
                    { className: 'b-folio__label' },
                    'Uwe Wittwer'
                  ),
                  React.h('img', {
                    className: 'b-folio__image',
                    src: '/assets/img/portfolio/uwewittwer.png',
                    alt: 'Uwe Wittwer'
                  })
                )
              ),
              React.h(
                'li',
                {
                  className: 'b-folio__item',
                  style: { backgroundColor: '#b72817' } },
                React.h(
                  'a',
                  {
                    className: 'b-folio__link',
                    href: '/2016/10/10/building-a-shopify-theme/' },
                  React.h(
                    'span',
                    { className: 'b-folio__label' },
                    'Shopify Theme'
                  ),
                  React.h('img', {
                    className: 'b-folio__image',
                    src: '/assets/img/portfolio/stshopify.png',
                    alt: 'Building a Shopify Theme'
                  })
                )
              ),
              React.h(
                'li',
                {
                  className: 'b-folio__item',
                  style: { backgroundColor: '#f05b26' } },
                React.h(
                  'a',
                  {
                    className: 'b-folio__link',
                    href: '/2016/01/04/css-framework-for-partsgiant/' },
                  React.h(
                    'span',
                    { className: 'b-folio__label' },
                    'PartsGiant'
                  ),
                  React.h('img', {
                    className: 'b-folio__image',
                    src: '/assets/img/portfolio/partsgiant.jpg',
                    alt: 'PartsGiant'
                  })
                )
              ),
              React.h(
                'li',
                {
                  className: 'b-folio__item',
                  style: { backgroundColor: '#5798da' } },
                React.h(
                  'a',
                  {
                    className: 'b-folio__link',
                    href: '/2014/02/17/introducing-tales/' },
                  React.h(
                    'span',
                    { className: 'b-folio__label' },
                    'Tales'
                  ),
                  React.h('img', {
                    className: 'b-folio__image',
                    src: '/assets/img/portfolio/tales.jpg',
                    alt: 'Tales'
                  })
                )
              )
            )
          ),
          React.h('br', null),
          React.h(
            'h2',
            null,
            'Graphic Design'
          ),
          React.h(
            'p',
            null,
            'Print, advertising, and editorial \u2014 these projects from my university degree helped develop my understanding of fundamental design principles.'
          ),
          React.h(
            'div',
            { className: 'b-folio' },
            React.h(
              'ul',
              { className: 'b-folio__list' },
              React.h(
                'li',
                {
                  className: 'b-folio__item',
                  style: { backgroundColor: '#45b0e5' } },
                React.h(
                  'a',
                  {
                    className: 'b-folio__link',
                    href: '/showcase/origami-unfolded/' },
                  React.h(
                    'span',
                    { className: 'b-folio__label' },
                    'Origami Unfolded'
                  ),
                  React.h('img', {
                    className: 'b-folio__image',
                    src: '/assets/img/portfolio/origami.jpg',
                    alt: 'Origami Unfolded'
                  })
                )
              ),
              React.h(
                'li',
                {
                  className: 'b-folio__item',
                  style: { backgroundColor: '#661f1f' } },
                React.h(
                  'a',
                  { className: 'b-folio__link', href: '/showcase/machinal/' },
                  React.h(
                    'span',
                    { className: 'b-folio__label' },
                    'Machinal'
                  ),
                  React.h('img', {
                    className: 'b-folio__image',
                    src: '/assets/img/portfolio/machinal.jpg',
                    alt: 'Machinal'
                  })
                )
              ),
              React.h(
                'li',
                {
                  className: 'b-folio__item',
                  style: { backgroundColor: '#e57300' } },
                React.h(
                  'a',
                  { className: 'b-folio__link', href: '/showcase/space-opera/' },
                  React.h(
                    'span',
                    { className: 'b-folio__label' },
                    'Space Opera'
                  ),
                  React.h('img', {
                    className: 'b-folio__image',
                    src: '/assets/img/portfolio/space.jpg',
                    alt: 'Space Opera'
                  })
                )
              ),
              React.h(
                'li',
                {
                  className: 'b-folio__item',
                  style: { backgroundColor: '#e5c72e' } },
                React.h(
                  'a',
                  { className: 'b-folio__link', href: '/showcase/seized/' },
                  React.h(
                    'span',
                    { className: 'b-folio__label' },
                    'Seized'
                  ),
                  React.h('img', {
                    className: 'b-folio__image',
                    src: '/assets/img/portfolio/seized.jpg',
                    alt: 'Seized'
                  })
                )
              ),
              React.h(
                'li',
                {
                  className: 'b-folio__item',
                  style: { backgroundColor: '#47b247' } },
                React.h(
                  'a',
                  {
                    className: 'b-folio__link',
                    href: '/showcase/digital-legibility/' },
                  React.h(
                    'span',
                    { className: 'b-folio__label' },
                    'Digital Legibility'
                  ),
                  React.h('img', {
                    className: 'b-folio__image',
                    src: '/assets/img/portfolio/digital.jpg',
                    alt: 'Digital Legibility'
                  })
                )
              ),
              React.h(
                'li',
                {
                  className: 'b-folio__item',
                  style: { backgroundColor: '#3c3c3c' } },
                React.h(
                  'a',
                  {
                    className: 'b-folio__link',
                    href: '/showcase/tamed-aggression/' },
                  React.h(
                    'span',
                    { className: 'b-folio__label' },
                    'Tamed Aggression'
                  ),
                  React.h('img', {
                    className: 'b-folio__image',
                    src: '/assets/img/portfolio/tamed.jpg',
                    alt: 'Tamed Aggression'
                  })
                )
              )
            )
          ),
          React.h('hr', { id: 'more' }),
          React.h(
            'h2',
            null,
            'Older Website Projects'
          ),
          React.h(
            'p',
            null,
            'Web design and front-end development from previous agencies I\u2019ve worked at.'
          ),
          React.h(
            'ul',
            null,
            React.h(
              'li',
              null,
              React.h(
                'a',
                { href: '/2013/08/09/responsive-design-for-kings-transfer/' },
                'King\u2019s Transfer'
              )
            ),
            React.h(
              'li',
              null,
              React.h(
                'a',
                { href: '/2012/06/17/passenger-focus-responsive-web-design-case-study/' },
                'Passenger Focus'
              )
            ),
            React.h(
              'li',
              null,
              React.h(
                'a',
                { href: '/2013/01/28/gloople-responsive-design-review/' },
                'Gloople'
              )
            ),
            React.h(
              'li',
              null,
              React.h(
                'a',
                { href: '/showcase/atherton-cox/' },
                'Atherton Cox'
              )
            ),
            React.h(
              'li',
              null,
              React.h(
                'a',
                { href: '/showcase/brucar/' },
                'Brucar'
              )
            ),
            React.h(
              'li',
              null,
              React.h(
                'a',
                { href: '/showcase/eden-anglo-french/' },
                'Eden Anglo French'
              )
            ),
            React.h(
              'li',
              null,
              React.h(
                'a',
                { href: '/showcase/my-life-listed/' },
                'MyLifeListed'
              )
            ),
            React.h(
              'li',
              null,
              React.h(
                'a',
                { href: '/showcase/peerless-av-europe/' },
                'Peerless AV Europe'
              )
            ),
            React.h(
              'li',
              null,
              React.h(
                'a',
                { href: '/showcase/shane-global/' },
                'Shane Global'
              )
            )
          )
        )
      )
    )
  );
};
Portfolio.defaultProps = {
  pageHeading: 'Portfolio'
};

var ver = window.dbushell.ver;
var history = window.history;
var docEl = document.documentElement;
var $app = document.querySelector('#app');
var $title = document.querySelector('title');
var $canonical = document.querySelector('link[rel="canonical"]');

var initProps = {
  pageProps: {
    pageHref: $canonical.href,
    pagePath: new URL($canonical.href).pathname,
    pageTitle: $title.innerText
  }
};

var offlineProps = {
  pageProps: offlinePageProps
};

function fetchURL(href) {
  var same = href === initProps.pageProps.pageHref;
  var url = new URL(href);
  var api = ('/api' + url.pathname + 'props.json?v=' + ver).replace('/spa/', '/');
  var init = {
    method: 'GET',
    mode: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  if (!same) {
    docEl.classList.add('js-loading');
    docEl.classList.add('js-loading-anim');
  }
  var start = Date.now();
  var finish = function finish() {
    setTimeout(function () {
      docEl.classList.remove('js-loading');
      setTimeout(function () {
        docEl.classList.remove('js-loading-anim');
      }, 300);
    }, Math.max(300 - (Date.now() - start), 0));
  };
  return window.fetch(api, init).then(function (response) {
    finish();
    if (response.status !== 200 || response.type !== 'basic') {
      throw new Error('Unknown API response');
    }
    return response.json().then(function (pageProps) {
      try {
        if (!same && window.ga) {
          window.ga('set', 'page', pageProps.pagePath);
          window.ga('send', 'pageview');
        }
      } catch (err) {}
      return pageProps;
    });
  }).catch(function (err) {
    console.log(err);
    finish();
    return offlineProps.pageProps;
  });
}

var Root = function (_Component) {
  inherits(Root, _Component);

  function Root(props) {
    classCallCheck(this, Root);

    var _this = possibleConstructorReturn(this, (Root.__proto__ || Object.getPrototypeOf(Root)).call(this, props));

    _this.state = {
      pageProps: _extends({}, props.pageProps)
    };
    _this.handleClick = _this.handleClick.bind(_this);
    _this.handlePopState = _this.handlePopState.bind(_this);
    return _this;
  }

  createClass(Root, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var href = window.location.href;

      history.replaceState({ href: href }, '', href);
      document.addEventListener('click', this.handleClick);
      window.addEventListener('popstate', this.handlePopState);
      window.dbushell.refresh(true);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('click', this.handleDocumentClick);
      window.removeEventListener('popstate', this.handlePopState);
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      var pageProps = this.state.pageProps;

      if (pageProps.pagePath !== nextState.pageProps.pagePath) {
        return true;
      }
      return false;
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      var pageProps = this.state.pageProps;

      if (pageProps.pagePath === nextState.pageProps.pagePath) {
        return;
      }
      window.scrollTo(0, 0);
      if ($title) {
        $title.textContent = nextState.pageProps.pageTitle;
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      window.dbushell.refresh();
    }
  }, {
    key: 'handleClick',
    value: function handleClick(e) {
      var href = e.target.href || e.target.parentNode.href;
      if (typeof href !== 'string') {
        return;
      }
      var url = new URL(href);
      if (url.host !== window.location.host) {
        return;
      }
      history.pushState({ href: url.href }, '', url.href);
      window.dispatchEvent(new window.PopStateEvent('popstate', { state: history.state }));
      e.preventDefault();
    }
  }, {
    key: 'handlePopState',
    value: function handlePopState(e) {
      var _this2 = this;

      if (!e.state || !e.state.href) {
        return;
      }
      var url = new URL(e.state.href);
      if (this.state.pageProps.pagePath === url.pathname) {
        window.scrollTo(0, 0);
        return;
      }
      fetchURL(url.href).then(function (pageProps) {
        _this2.setState(function () {
          return { pageProps: pageProps };
        });
      });
    }
  }, {
    key: 'render',
    value: function render$$1() {
      var pageProps = this.state.pageProps;
      var pagePath$$1 = pageProps.pagePath;

      var el = void 0;
      if (pagePath$$1 === '/') {
        el = Home;
      } else if (/^\/contact\/$/.test(pagePath$$1)) {
        el = Contact;
      } else if (/^\/pattern-library\/$/.test(pagePath$$1)) {
        el = Patterns;
      } else if (/^\/showcase\/$/.test(pagePath$$1)) {
        el = Portfolio;
      } else if (/^\/blog\//.test(pagePath$$1)) {
        el = Archive;
      } else if (/^\/\d{4}\/\d{2}\/\d{2}\//.test(pagePath$$1)) {
        el = Article;
      } else {
        el = Page;
      }
      return React.h(
        'div',
        null,
        React.h(el, pageProps),
        React.h(Footer, null),
        React.h(Nav, null)
      );
    }
  }]);
  return Root;
}(Component);

function bootApp() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initProps;

  $app.innerHTML = '';
  docEl.classList.add('js-app');
  React.render(React.h(Root, props), $app);
}

if ($app) {
  if (initProps.pageProps.pagePath === '/') {
    bootApp();
  } else {
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = '/assets/css/all.post.css?v=' + ver;
    document.querySelector('head').appendChild(css);
    fetchURL(initProps.pageProps.pageHref).then(function (pageProps) {
      bootApp({ pageProps: pageProps });
    });
  }
}

}());
