(function () {
'use strict';

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

/**
 * JSX/hyperscript reviver.
 * @see http://jasonformat.com/wtf-is-jsx
 * Benchmarks: https://esbench.com/bench/57ee8f8e330ab09900a1a1a0
 *
 * Note: this is exported as both `h()` and `createElement()` for compatibility reasons.
 *
 * Creates a VNode (virtual DOM element). A tree of VNodes can be used as a lightweight representation
 * of the structure of a DOM tree. This structure can be realized by recursively comparing it against
 * the current _actual_ DOM structure, and applying only the differences.
 *
 * `h()`/`createElement()` accepts an element name, a list of attributes/props,
 * and optionally children to append to the element.
 *
 * @example The following DOM tree
 *
 * `<div id="foo" name="bar">Hello!</div>`
 *
 * can be constructed using this function as:
 *
 * `h('div', { id: 'foo', name : 'bar' }, 'Hello!');`
 *
 * @param {string} nodeName	An element name. Ex: `div`, `a`, `span`, etc.
 * @param {Object} attributes	Any attributes/props to set on the created element.
 * @param rest			Additional arguments are taken to be children to append. Can be infinitely nested Arrays.
 *
 * @public
 */
function h(nodeName, attributes) {
	var children = EMPTY_CHILDREN,
	    lastSimple,
	    child,
	    simple,
	    i;
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
			if (typeof child === 'boolean') child = null;

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

/**
 *  Copy all properties from `props` onto `obj`.
 *  @param {Object} obj		Object onto which properties should be copied.
 *  @param {Object} props	Object from which to copy properties.
 *  @returns obj
 *  @private
 */
function extend(obj, props) {
	for (var i in props) {
		obj[i] = props[i];
	}return obj;
}

/**
 * Call a function asynchronously, as soon as possible. Makes
 * use of HTML Promise to schedule the callback if available,
 * otherwise falling back to `setTimeout` (mainly for IE<11).
 *
 * @param {Function} callback
 */
var defer = typeof Promise == 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

/**
 * Clones the given VNode, optionally adding attributes/props and replacing its children.
 * @param {VNode} vnode		The virutal DOM element to clone
 * @param {Object} props	Attributes/props to add when cloning
 * @param {VNode} rest		Any additional arguments will be used as replacement children.
 */
function cloneElement(vnode, props) {
	return h(vnode.nodeName, extend(extend({}, vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
}

// DOM properties that should NOT have "px" added when numeric
var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

/** Managed queue of dirty components to be re-rendered */

var items = [];

function enqueueRender(component) {
	if (!component._dirty && (component._dirty = true) && items.push(component) == 1) {
		(options.debounceRendering || defer)(rerender);
	}
}

function rerender() {
	var p,
	    list = items;
	items = [];
	while (p = list.pop()) {
		if (p._dirty) renderComponent(p);
	}
}

/**
 * Check if two nodes are equivalent.
 *
 * @param {Node} node			DOM Node to compare
 * @param {VNode} vnode			Virtual DOM node to compare
 * @param {boolean} [hyrdating=false]	If true, ignores component constructors when comparing.
 * @private
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

/**
 * Check if an Element has a given nodeName, case-insensitively.
 *
 * @param {Element} node	A DOM Element to inspect the name of.
 * @param {String} nodeName	Unnormalized name to compare against.
 */
function isNamedNode(node, nodeName) {
	return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
}

/**
 * Reconstruct Component-style `props` from a VNode.
 * Ensures default/fallback values from `defaultProps`:
 * Own-properties of `defaultProps` not present in `vnode.attributes` are added.
 *
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
	var parentNode = node.parentNode;
	if (parentNode) parentNode.removeChild(node);
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
			for (var i in value) {
				node.style[i] = typeof value[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false ? value[i] + 'px' : value[i];
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
	var c;
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

		// hydration is indicated by the existing element to be diffed not having a prop cache
		hydrating = dom != null && !('__preactattr_' in dom);
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

	// empty values (null, undefined, booleans) render as empty Text nodes
	if (vnode == null || typeof vnode === 'boolean') vnode = '';

	// Fast case: Strings & Numbers create/update Text nodes.
	if (typeof vnode === 'string' || typeof vnode === 'number') {

		// update if it's already a Text node:
		if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
			/* istanbul ignore if */ /* Browser quirk that can't be covered: https://github.com/developit/preact/commit/fd4f21f5c45dfd75151bd27b4c217d8003aa5eb9 */
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

		out['__preactattr_'] = true;

		return out;
	}

	// If the VNode represents a Component, perform a component diff:
	var vnodeName = vnode.nodeName;
	if (typeof vnodeName === 'function') {
		return buildComponentFromVNode(dom, vnode, context, mountAll);
	}

	// Tracks entering and exiting SVG namespace when descending through the tree.
	isSvgMode = vnodeName === 'svg' ? true : vnodeName === 'foreignObject' ? false : isSvgMode;

	// If there's no existing element or it's the wrong type, create a new one:
	vnodeName = String(vnodeName);
	if (!dom || !isNamedNode(dom, vnodeName)) {
		out = createNode(vnodeName, isSvgMode);

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
	    props = out['__preactattr_'],
	    vchildren = vnode.children;

	if (props == null) {
		props = out['__preactattr_'] = {};
		for (var a = out.attributes, i = a.length; i--;) {
			props[a[i].name] = a[i].value;
		}
	}

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
	    j,
	    c,
	    f,
	    vchild,
	    child;

	// Build up a map of keyed children and an Array of unkeyed children:
	if (len !== 0) {
		for (var i = 0; i < len; i++) {
			var _child = originalChildren[i],
			    props = _child['__preactattr_'],
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
		for (var i = 0; i < vlen; i++) {
			vchild = vchildren[i];
			child = null;

			// attempt to find a node based on key matching
			var key = vchild.key;
			if (key != null) {
				if (keyedLen && keyed[key] !== undefined) {
					child = keyed[key];
					keyed[key] = undefined;
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

			f = originalChildren[i];
			if (child && child !== dom && child !== f) {
				if (f == null) {
					dom.appendChild(child);
				} else if (child === f.nextSibling) {
					removeNode(f);
				} else {
					dom.insertBefore(child, f);
				}
			}
		}
	}

	// remove unused keyed children:
	if (keyedLen) {
		for (var i in keyed) {
			if (keyed[i] !== undefined) recollectNodeTree(keyed[i], false);
		}
	}

	// remove orphaned unkeyed children:
	while (min <= childrenLen) {
		if ((child = children[childrenLen--]) !== undefined) recollectNodeTree(child, false);
	}
}

/** Recursively recycle (or just unmount) a node and its descendants.
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
		if (node['__preactattr_'] != null && node['__preactattr_'].ref) node['__preactattr_'].ref(null);

		if (unmountOnly === false || node['__preactattr_'] == null) {
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
	var name;

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
	    inst;

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

	if (opts !== 0) {
		if (opts === 1 || options.syncComponentUpdates !== false || !component.base) {
			renderComponent(component, 1, mountAll);
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
	    rendered,
	    inst,
	    cbase;

	// if updating
	if (isUpdate) {
		component.props = previousProps;
		component.state = previousState;
		component.context = previousContext;
		if (opts !== 2 && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false) {
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
		    toUnmount,
		    base;

		if (typeof childComponent === 'function') {
			// set up high order component link

			var childProps = getNodeProps(rendered);
			inst = initialChildComponent;

			if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
				setComponentProps(inst, childProps, 1, context, false);
			} else {
				toUnmount = inst;

				component._component = inst = createComponent(childComponent, childProps, context);
				inst.nextBase = inst.nextBase || nextBase;
				inst._parentComponent = component;
				setComponentProps(inst, childProps, 0, context, false);
				renderComponent(inst, 1, mountAll, true);
			}

			base = inst.base;
		} else {
			cbase = initialBase;

			// destroy high order component link
			toUnmount = initialChildComponent;
			if (toUnmount) {
				cbase = component._component = null;
			}

			if (initialBase || opts === 1) {
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
		// Note: disabled as it causes duplicate hooks, see https://github.com/developit/preact/issues/750
		// flushMounts();

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
		setComponentProps(c, props, 3, context, mountAll);
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
		setComponentProps(c, props, 1, context, mountAll);
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
		if (base['__preactattr_'] && base['__preactattr_'].ref) base['__preactattr_'].ref(null);

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
		renderComponent(this, 2);
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

var preact = {
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
    return preact.h(
      'main',
      {
        className: ['c-main'].concat(props.classList).join(' ').trim() },
      props.children
    );
  }
  return preact.h(
    'div',
    {
      className: ['b-block'].concat(props.classList).join(' ').trim() },
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
  return preact.h(
    'section',
    attr,
    preact.h(
      'div',
      { className: 'b-bio__image' },
      preact.h('img', {
        src: props.imageSrc,
        srcSet: props.imageSrcset,
        alt: props.imageAlt
      })
    ),
    preact.h(
      'div',
      { className: 'b-bio__main' },
      preact.h(
        'h3',
        { itemProp: 'name' },
        preact.h(
          'a',
          { href: props.href },
          props.title
        )
      ),
      preact.h(
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
  return preact.h(
    'time',
    attr,
    time.dddd,
    ' ',
    preact.h(
      'b',
      null,
      time.D,
      ' ',
      preact.h(
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
  return preact.h(
    'li',
    { className: 'b-blog__item' },
    preact.h(
      'a',
      { rel: 'bookmark', href: props.href },
      props.title
    ),
    preact.h(Time, { date: props.date })
  );
};
var Blog = function Blog(props) {
  var attr = {
    className: 'b-blog',
    role: 'navigation'
  };
  return preact.h(
    'aside',
    attr,
    preact.h(
      'div',
      { className: 'b-blog__title' },
      preact.h(
        'h3',
        null,
        props.heading
      )
    ),
    preact.h(
      'ul',
      { className: 'b-blog__list' },
      props.items.map(function (item) {
        return preact.h(BlogItem, _extends({ key: item.id }, item));
      })
    )
  );
};

var Small = function Small(props) {
  return preact.h(
    'p',
    null,
    preact.h(
      'small',
      null,
      props.children
    )
  );
};

var heading = "From the blog…";
var items$1 = [{ "id": "react-redux-internationalisation", "title": "React & Redux - Internationalisation", "href": "/2018/04/05/react-redux-internationalisation/", "date": 1522922400000 }, { "id": "codepen-snippets", "title": "CodePen Snippets", "href": "/2018/02/21/codepen-snippets/", "date": 1519207200000 }, { "id": "hello-2018", "title": "Hello Twenty Eighteen", "href": "/2018/01/11/hello-2018/", "date": 1515664800000 }, { "id": "raspberry-pi-epaper", "title": "Raspberry Pi + e-Paper module + Node.js", "href": "/2017/09/20/raspberry-pi-epaper/", "date": 1505901600000 }, { "id": "tifu-by-deleting-my-work", "title": "#TIFU by deleting my work", "href": "/2017/08/15/tifu-by-deleting-my-work/", "date": 1502791200000 }, { "id": "ssh-passphrases-in-macos-sierra", "title": "SSH Passphrases in MacOS Sierra (and learning Vim)", "href": "/2017/05/18/ssh-passphrases-in-macos-sierra/", "date": 1495101600000 }];
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
  var hire = preact.h(
    'a',
    { href: '/contact/', className: 'b-hire' },
    preact.h('img', {
      className: 'b-hire__image',
      src: '/assets/img/dbushell-for-hire.svg',
      alt: 'Available for Hire'
    })
  );
  return preact.h(
    'footer',
    attr,
    preact.h(
      Block,
      null,
      preact.h(Bio, null),
      props.isHirable ? hire : preact.h('hr', null),
      preact.h(Blog, blogProps()),
      preact.h('hr', null),
      preact.h(
        Small,
        null,
        'Copyright \xA9 ',
        new Date().getFullYear(),
        ' ',
        preact.h(
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
  // const attr = {
  //   role: 'presentation'
  // };
  return preact.h('svg', { dangerouslySetInnerHTML: icon(props.id) });
};

var heading$1 = "Website Navigation";
var items$2 = [{ "order": 1, "priority": 1, "text": "Home", "href": "/" }, { "order": 2, "priority": 4, "text": "About", "href": "/about/" }, { "order": 3, "priority": 2, "text": "Services", "href": "/services/" }, { "order": 4, "priority": 5, "text": "Portfolio", "href": "/showcase/" }, { "order": 5, "priority": 6, "text": "Blog", "href": "/blog/" }, { "order": 6, "priority": 3, "text": "Contact", "href": "/contact/" }];
var defaults$2 = {
	heading: heading$1,
	items: items$2
};

var NavItem = function NavItem(props) {
  var attr = {
    className: 'b-nav__item'
  };
  attr['data-priority'] = props.priority;
  attr['data-order'] = props.order;
  if (props.active) {
    attr.className += ' b-nav__item--active';
  }
  return preact.h(
    'li',
    attr,
    preact.h(
      'a',
      { href: props.href, className: 'b-nav__link' },
      props.text
    )
  );
};
var Nav = function Nav(props) {
  var pagePath = props.pagePath;

  if (pagePath) {
    props.items.forEach(function (item) {
      item.active = false;
      if (item.href === pagePath) {
        item.active = true;
      }
      if (/^\/blog\//.test(item.href) && /^\/\d{4}\/\d{2}\/\d{2}\//.test(pagePath)) {
        item.active = true;
      }
    });
  }
  return preact.h(
    'nav',
    { className: 'b-nav', id: 'nav' },
    preact.h(
      'h2',
      { className: 'b-nav__title u-vh' },
      props.heading
    ),
    preact.h(
      'ul',
      { className: 'b-nav__list', 'data-root': 'true' },
      props.items.map(function (item) {
        return preact.h(NavItem, _extends({ key: item.order }, item));
      }),
      preact.h(
        'li',
        {
          className: 'b-nav__item b-nav__item--icons',
          'data-priority': props.items.length + 1,
          'data-order': props.items.length + 1 },
        preact.h(
          'a',
          {
            className: 'b-nav__link',
            rel: 'me noopener noreferrer',
            target: '_blank',
            title: 'David Bushell on Twitter',
            href: 'http://twitter.com/dbushell' },
          preact.h(Icon, { id: 'twitter' }),
          preact.h(
            'span',
            { className: 'u-vh' },
            '@dbushell'
          )
        ),
        preact.h(
          'a',
          {
            className: 'b-nav__link',
            rel: 'me noopener noreferrer',
            target: '_blank',
            title: 'David Bushell on GitHub',
            href: 'https://github.com/dbushell/' },
          preact.h(Icon, { id: 'github' }),
          preact.h(
            'span',
            { className: 'u-vh' },
            'GitHub'
          )
        ),
        preact.h(
          'a',
          {
            className: 'b-nav__link',
            rel: 'me noopener noreferrer',
            target: '_blank',
            title: 'David Bushell on CodePen',
            href: 'http://codepen.io/dbushell/' },
          preact.h(Icon, { id: 'codepen' }),
          preact.h(
            'span',
            { className: 'u-vh' },
            'CodePen'
          )
        )
      )
    ),
    preact.h(
      'div',
      { className: 'b-nav__more' },
      preact.h(
        'button',
        { type: 'button', className: 'b-nav__link' },
        preact.h(Icon, { id: 'nav' })
      ),
      preact.h('ul', { className: 'b-nav__dropdown' })
    )
  );
};
Nav.defaultProps = defaults$2;

var ButtonLabel = function ButtonLabel(props) {
  return preact.h(
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
  var label = preact.h(ButtonLabel, { text: props.text });
  var button = void 0;
  if (props.submit) {
    button = preact.h(
      'button',
      _extends({ type: 'submit' }, attr),
      label
    );
  } else {
    button = preact.h(
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
  return preact.h(
    'article',
    attr,
    preact.h(
      'h3',
      { className: 'b-post__title' },
      preact.h(
        'a',
        { href: props.href },
        props.title
      )
    ),
    preact.h(
      'p',
      { className: 'b-post__date' },
      preact.h(Time, { date: props.date })
    ),
    preact.h(
      'div',
      { className: 'b-post__body' },
      preact.h('p', { dangerouslySetInnerHTML: body() })
    )
  );
};

var Post = function Post(props) {
  var classList = ['b-post'].concat(props.classList);
  return preact.h(
    'div',
    { className: classList.join(' ').trim() },
    props.children
  );
};

var Archive = function Archive(props) {
  var nextButton = props.nextPage ? preact.h(Button, { href: props.nextPage, text: 'Older' }) : null;
  var prevButton = props.prevPage ? preact.h(Button, { href: props.prevPage, text: 'Newer' }) : null;
  var pagination = nextButton || prevButton ? preact.h(
    'div',
    { className: 'b-pagination' },
    nextButton,
    prevButton
  ) : null;
  var items = [];
  props.excerpts.forEach(function (item) {
    items.push(preact.h(Excerpt, _extends({ key: item.id }, item)));
    items.push(preact.h('hr', { key: item.id + '-hr' }));
  });
  return preact.h(
    Block,
    { isMain: true },
    preact.h(
      Block,
      null,
      preact.h(
        Post,
        null,
        preact.h(
          'div',
          { className: 'b-post__title' },
          preact.h(
            'h1',
            null,
            props.pageHeading
          )
        ),
        preact.h(
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
  return preact.h(
    'div',
    { className: 'b-boxed b-boxed--dark u-dark' },
    preact.h(
      'h3',
      null,
      props.title
    ),
    preact.h('p', { dangerouslySetInnerHTML: paragraph$$1() }),
    preact.h(Button, { bg1: true, href: props.href, text: props.link })
  );
};
Cta.defaultProps = defaults$3;

var Field = function Field(props) {
  var attr = {
    className: 'e-field'
  };
  return preact.h('input', _extends({}, attr, props));
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
  return preact.h(
    'label',
    attr,
    props.text
  );
};

var Newsletter = function Newsletter() {
  return preact.h(
    'aside',
    { className: 'b-newsletter', role: 'complementary' },
    preact.h(
      'div',
      { className: 'b-boxed b-boxed--light' },
      preact.h(
        'div',
        { className: 'b-newsletter__header' },
        preact.h(
          'h4',
          null,
          'Side projects newsletter'
        ),
        preact.h(
          'p',
          { className: 'p--small' },
          'Every now and then I release something cool, be the first to know!'
        )
      ),
      preact.h(
        'form',
        {
          noValidate: true,
          className: 'b-form',
          id: 'newsletter',
          action: '//dbushell.us1.list-manage.com/subscribe/post?u=f1621b8d47b205bc9a898c68f&id=84a4c62ca9',
          method: 'post',
          name: 'mc-embedded-subscribe-form',
          target: '_blank' },
        preact.h(
          'div',
          { className: 'b-form__item' },
          preact.h(Label, { field: 'mce-EMAIL', text: 'Email Address' }),
          preact.h(Field, {
            type: 'email',
            name: 'EMAIL',
            id: 'mce-EMAIL',
            placeholder: 'me@example.com\u2026'
          })
        ),
        preact.h(
          'div',
          { className: 'b-form__item' },
          preact.h(Label, { text: 'Email Format:' }),
          preact.h(
            'label',
            { htmlFor: 'mce-EMAILTYPE-0', className: 'e-label e-label--radio' },
            preact.h('input', {
              defaultChecked: true,
              className: 'u-vh',
              type: 'radio',
              value: 'html',
              name: 'EMAILTYPE',
              id: 'mce-EMAILTYPE-0'
            }),
            preact.h(
              'span',
              null,
              'HTML'
            )
          ),
          preact.h(
            'label',
            { htmlFor: 'mce-EMAILTYPE-1', className: 'e-label e-label--radio' },
            preact.h('input', {
              className: 'u-vh',
              type: 'radio',
              value: 'text',
              name: 'EMAILTYPE',
              id: 'mce-EMAILTYPE-1'
            }),
            preact.h(
              'span',
              null,
              'Text'
            )
          )
        ),
        preact.h(
          'div',
          { className: 'b-form__item' },
          preact.h(
            'div',
            { className: 'u-vh', 'aria-hidden': 'true' },
            preact.h('input', {
              type: 'text',
              name: 'b_f1621b8d47b205bc9a898c68f_84a4c62ca9',
              value: ''
            })
          ),
          preact.h(Button, { submit: true, text: 'Subscribe', name: 'subscribe' })
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
      return preact.h(
        'p',
        { className: 'b-post__date' },
        preact.h(Time, { date: props.dateUnix })
      );
    }
  };
  var ctaProps = {
    title: 'More from me…',
    link: 'Why not hire me!',
    paragraph: '<a href="/blog/">Read more on my blog</a> and follow <a rel="me noopener noreferrer" target="_blank" href="http://twitter.com/dbushell" title="David Bushell on Twitter">@dbushell</a>. If you like what I do:'
  };
  return preact.h(
    Block,
    { isMain: true },
    preact.h(
      Block,
      null,
      preact.h(
        Post,
        null,
        preact.h('h1', { className: 'b-post__title', dangerouslySetInnerHTML: title() }),
        date(),
        preact.h('div', { className: 'b-post__body', dangerouslySetInnerHTML: body() })
      ),
      preact.h('hr', null),
      preact.h(Cta, ctaProps),
      preact.h(Newsletter, null)
    )
  );
};
Article.defaultProps = {
  pageHeading: 'Untitled',
  dateUnix: Date.now()
};

var contactScript = '\nvar href = window.location.href;\nvar form = document.getElementById(\'contact-form\');\nvar para = document.createElement(\'p\');\nif (href.indexOf(\'?success=true\') !== -1) {\n  para.innerHTML = \'<hr><strong>Thank you for your enquiry, I\u2019ll reply as soon as possible.</strong>\';\n  form.style.cssText = \'display: none;\';\n}\nif (href.indexOf(\'?error=true\') !== -1) {\n  para.className = \'u-error\';\n  para.innerHTML = \'<strong>There was an error submitting your enquiry, please email me on the address above.</strong>\';\n}\nif (href.indexOf(\'?error=empty\') !== -1) {\n  para.className = \'u-error\';\n  para.innerHTML = \'<strong>Please enter your name, email address, and enquiry.</strong>\';\n}\nif (href.indexOf(\'?error=email\') !== -1) {\n  para.className = \'u-error\';\n  para.innerHTML = \'<strong>Please enter a valid email address.</strong>\';\n}\nif (para.innerHTML.length > 0) {\n  form.parentNode.insertBefore(para, form);\n}\n';
var Contact = function Contact(props) {
  return preact.h(
    Block,
    { isMain: true },
    preact.h(
      Block,
      null,
      preact.h(
        Post,
        null,
        preact.h(
          'div',
          { className: 'b-post__title' },
          preact.h(
            'h1',
            null,
            props.pageHeading
          )
        ),
        preact.h(
          'div',
          { className: 'b-post__body' },
          preact.h(
            'p',
            null,
            'Need help with your website?'
          ),
          preact.h(
            'p',
            { className: 'p--large' },
            preact.h(
              'b',
              null,
              preact.h(
                'a',
                { href: 'mailto:hi@dbushell.com' },
                'hi@dbushell.com'
              )
            )
          ),
          preact.h(
            'p',
            null,
            'or use the form below:'
          ),
          preact.h(
            'form',
            {
              className: 'b-form',
              id: 'contact-form',
              method: 'post',
              action: 'https://formspree.io/hi@dbushell.com' },
            preact.h('input', {
              type: 'hidden',
              name: '_next',
              value: 'http://dbushell.com/contact/?success=true'
            }),
            preact.h('input', {
              type: 'hidden',
              name: '_subject',
              value: 'dbushell.com enquiry'
            }),
            preact.h(
              'ul',
              { className: 'b-form__list' },
              preact.h(
                'li',
                { className: 'b-form__item' },
                preact.h(Label, { field: 'contact-name', text: 'Name' }),
                preact.h(Field, { id: 'contact-name', name: 'name' })
              ),
              preact.h(
                'li',
                { className: 'b-form__item' },
                preact.h(Label, { field: 'contact-email', text: 'Email Address' }),
                preact.h(Field, {
                  type: 'email',
                  id: 'contact-email',
                  name: '_replyto',
                  placeholder: 'me@example.com\u2026'
                })
              ),
              preact.h(
                'li',
                { className: 'b-form__item' },
                preact.h(
                  'h4',
                  null,
                  preact.h(
                    'strong',
                    null,
                    'Have a project in mind?'
                  )
                ),
                preact.h(
                  'p',
                  { className: 'p--small' },
                  'I can provide a ',
                  preact.h(
                    'b',
                    null,
                    'free quote.'
                  ),
                  ' Please provide as much detail as possible \u2014 budget, requirements, timelines \u2014 so I can answer you quickly. If I\u2019m not available now we can book in advance.'
                ),
                preact.h(Label, { field: 'contact-enquiry', text: 'Enquiry' }),
                preact.h('textarea', {
                  required: true,
                  className: 'e-field e-field--area',
                  id: 'contact-enquiry',
                  name: 'enquiry',
                  rows: 5
                })
              ),
              preact.h(
                'li',
                { className: 'b-form__item u-vh' },
                preact.h(Label, {
                  field: 'contact-human',
                  text: 'If you\u2019re human leave the next field blank!'
                }),
                preact.h('input', {
                  type: 'text',
                  id: 'contact-human',
                  name: '_gotcha',
                  tabIndex: -1
                })
              ),
              preact.h(
                'li',
                { className: 'b-form__item' },
                preact.h(Button, { submit: true, text: 'Send Message' })
              )
            )
          ),
          preact.h('script', { dangerouslySetInnerHTML: { __html: contactScript } })
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
  return preact.h(
    'blockquote',
    null,
    preact.h(
      'p',
      { className: 'p--large p--quote' },
      props.quote
    ),
    preact.h(
      'p',
      { className: 'p--small' },
      preact.h(
        'cite',
        null,
        props.href ? preact.h(
          'a',
          { href: props.href },
          props.cite
        ) : props.cite
      )
    )
  );
};
var Clients = function Clients(props) {
  return preact.h(
    'div',
    { className: 'c-clients u-dark' },
    preact.h(
      Block,
      null,
      preact.h(
        'div',
        { className: 'c-clients__header' },
        preact.h(
          'h2',
          null,
          props.heading
        )
      ),
      props.blockquotes.map(function (item) {
        return preact.h(ClientsItem, _extends({ key: item.id }, item));
      }),
      preact.h(
        'div',
        { className: 'c-clients__footer' },
        preact.h(Button, props.button)
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
  return preact.h(
    'li',
    { className: 'b-folio__item', style: { backgroundColor: props.bgColor } },
    preact.h(
      'a',
      { className: 'b-folio__link', href: props.href },
      preact.h(
        'span',
        { className: 'b-folio__label' },
        props.heading
      ),
      preact.h('img', {
        className: 'b-folio__image',
        src: props.imageSrc,
        alt: props.imageAlt
      })
    )
  );
};
var Folio = function Folio(props) {
  return preact.h(
    'div',
    { className: 'c-folio' },
    preact.h(
      Block,
      null,
      preact.h(
        'div',
        { className: 'c-folio__header' },
        preact.h(
          'h2',
          null,
          preact.h(
            'a',
            { href: props.href },
            props.heading
          )
        )
      ),
      preact.h(
        'div',
        { className: 'b-folio' },
        preact.h(
          'ul',
          { className: 'b-folio__list' },
          props.items.map(function (item) {
            return preact.h(FolioItem, _extends({ key: item.href }, item));
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
    className: 'e-star'
    // role: 'presentation'
  };
  if (props.blink) {
    attr.className += ' e-star--blink';
  }
  return preact.h('svg', _extends({}, attr, { dangerouslySetInnerHTML: star(props.id) }));
};
Star.defaultProps = {
  id: 'star'
};

var heading$4 = "David Bushell – Web Design & Front-end Development (based in Manchester, UK)";
var defaults$6 = {
	heading: heading$4
};

var Hero = function Hero(props) {
  return preact.h(
    'header',
    { className: 'c-hero' },
    preact.h(
      Block,
      null,
      preact.h(
        'div',
        { className: 'c-hero__logo' },
        preact.h(
          'h1',
          { className: 'u-vh' },
          props.heading
        ),
        preact.h('img', { src: '/assets/img/david-bushell.svg', alt: 'David Bushell' })
      ),
      preact.h('div', { className: 'c-hero__burst' }),
      preact.h('div', { className: 'c-hero__crane' }),
      preact.h(Star, { blink: true, id: 'star' }),
      preact.h(Star, { blink: true, id: 'burst' }),
      preact.h(Star, { blink: true, id: 'star' })
    ),
    preact.h(
      'div',
      { className: 'c-hero__bg' },
      preact.h(
        'div',
        null,
        preact.h(
          'svg',
          { xmlns: 'http://www.w3.org/2000/svg' },
          preact.h('path', { className: 'st0', d: 'M3000 600H0V0z' }),
          preact.h('path', { className: 'st1', d: 'M-4.5 2.5l3005 601' }),
          preact.h('path', { className: 'st2', d: 'M-4.5 9.5l3005 601' })
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
  return preact.h(
    'article',
    attr,
    preact.h(Star, { id: starId }),
    preact.h(
      'div',
      { className: 'b-sector__header' },
      preact.h(
        'h2',
        { className: 'u-bright' },
        props.heading
      ),
      preact.h(
        'p',
        { className: 'p--large u-dim' },
        props.subheading
      )
    ),
    preact.h(
      'div',
      { className: 'b-sector__main' },
      preact.h(
        'p',
        null,
        props.description
      )
    ),
    preact.h(Button, buttonAttr)
  );
};

var items$4 = [{ "rtl": true, "alt": true, "heading": "For Businesses", "subheading": "Have an idea?", "description": "Let’s discuss your requirements, share ideas, and figure out what’s best for your new website together.", "button": { "text": "How I can help", "href": "/working-with-clients/" } }, { "heading": "Web Agencies", "subheading": "Need a hand?", "description": "I’m reliable and flexible, priding myself in communication and initiative to ensure smooth delivery.", "button": { "text": "What I can do", "href": "/working-with-agencies/" } }];
var defaults$7 = {
	items: items$4
};

var Sectors = function Sectors(_ref) {
  var items = _ref.items;

  return preact.h(
    'div',
    { className: 'c-sectors' },
    preact.h(
      Block,
      null,
      preact.h(
        'div',
        { className: 'c-sectors__list' },
        preact.h(
          'div',
          { className: 'c-sectors__item' },
          preact.h(Sector, items[0])
        ),
        preact.h(
          'div',
          { className: 'c-sectors__item' },
          preact.h(Sector, items[1])
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
  return preact.h(
    'article',
    { className: 'c-steps__item' },
    preact.h(
      'h2',
      { className: 'h4' },
      preact.h(
        'a',
        { href: props.href },
        props.heading
      )
    ),
    preact.h(
      'p',
      null,
      props.description
    ),
    props.button ? preact.h(Button, props.button) : null
  );
};
var Steps = function Steps(props) {
  var items = [];
  var key = 0;
  var id = function id() {
    return ++key;
  };
  props.items.forEach(function (item, i) {
    items.push(preact.h(StepsItem, _extends({ key: id() }, item)));
    if (i < props.items.length - 1) {
      items.push(preact.h('hr', { key: id() }));
    }
  });
  return preact.h(
    'div',
    { className: 'c-steps' },
    preact.h(
      Block,
      null,
      preact.h(
        'div',
        { className: 'c-steps__list' },
        items
      )
    )
  );
};
Steps.defaultProps = defaults$8;

var Home = function Home() {
  return preact.h(
    Block,
    { isMain: true, classList: ['c-main--home'] },
    preact.h(Hero, null),
    preact.h(Steps, null),
    preact.h(Sectors, null),
    preact.h(Folio, null),
    preact.h(Clients, null)
  );
};
Home.defaultProps = {
  pageHeading: 'David Bushell – Web Design & Front-end Development (based in Manchester, UK)'
};

var Page = function Page(props) {
  var postBody = props.innerHTML ? preact.h('div', {
    className: 'b-post__body',
    dangerouslySetInnerHTML: { __html: props.innerHTML }
  }) : preact.h(
    'div',
    { className: 'b-post__body' },
    props.children
  );
  return preact.h(
    Block,
    { isMain: true },
    preact.h(
      Block,
      null,
      preact.h(
        Post,
        null,
        preact.h(
          'div',
          { className: 'b-post__title' },
          preact.h(
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
  return preact.h(
    Block,
    { isMain: true },
    preact.h(
      Block,
      null,
      preact.h(
        Post,
        null,
        preact.h(
          'div',
          { className: 'b-post__title' },
          preact.h(
            'h1',
            null,
            props.pageHeading
          )
        ),
        preact.h('hr', null),
        preact.h(
          'h2',
          null,
          'Biography'
        ),
        preact.h(
          'div',
          { className: 'b-post__pattern' },
          preact.h(Bio, null)
        ),
        preact.h(
          'h2',
          null,
          'Blog latest'
        ),
        preact.h(
          'div',
          { className: 'b-post__pattern' },
          preact.h(Blog, blogProps$1)
        ),
        preact.h(
          'h2',
          null,
          'Call to Action'
        ),
        preact.h(
          'div',
          { className: 'b-post__pattern' },
          preact.h(Cta, null)
        ),
        preact.h(
          'h2',
          null,
          'Newsletter'
        ),
        preact.h(
          'div',
          { className: 'b-post__pattern' },
          preact.h(Newsletter, null)
        ),
        preact.h(
          'h2',
          null,
          'Sector'
        ),
        preact.h(
          'div',
          { className: 'b-post__pattern' },
          preact.h(Sector, Sectors.defaultProps.items[1])
        ),
        preact.h(
          'h2',
          null,
          'Sector RTL'
        ),
        preact.h(
          'div',
          { className: 'b-post__pattern' },
          preact.h(Sector, Sectors.defaultProps.items[0])
        )
      )
    )
  );
};
Patterns.defaultProps = {
  pageHeading: 'Pattern Library'
};

var Portfolio = function Portfolio(props) {
  return preact.h(
    Block,
    { isMain: true },
    preact.h(
      Block,
      null,
      preact.h(
        Post,
        null,
        preact.h(
          'div',
          { className: 'b-post__title' },
          preact.h(
            'h1',
            null,
            props.pageHeading
          )
        ),
        preact.h(
          'div',
          { className: 'b-post__body' },
          preact.h(
            'p',
            null,
            'Selected web design and front-end development projects.'
          ),
          preact.h(
            'div',
            { className: 'b-folio' },
            preact.h(
              'ul',
              { className: 'b-folio__list' },
              preact.h(
                'li',
                {
                  className: 'b-folio__item',
                  style: { backgroundColor: '#29313d' } },
                preact.h(
                  'a',
                  {
                    className: 'b-folio__link',
                    href: '/2016/07/14/building-a-wordpress-theme/' },
                  preact.h(
                    'span',
                    { className: 'b-folio__label' },
                    'Base Creative / WordPress'
                  ),
                  preact.h('img', {
                    className: 'b-folio__image',
                    src: '/assets/img/portfolio/bcwordpress.png',
                    alt: 'Building a WordPress Theme designed by Base Creative, London'
                  })
                )
              ),
              preact.h(
                'li',
                {
                  className: 'b-folio__item',
                  style: { backgroundColor: '#d8ac59' } },
                preact.h(
                  'a',
                  {
                    className: 'b-folio__link',
                    href: '/2015/03/18/responsive-design-for-houden/' },
                  preact.h(
                    'span',
                    { className: 'b-folio__label' },
                    'Houden'
                  ),
                  preact.h('img', {
                    className: 'b-folio__image',
                    src: '/assets/img/portfolio/houden.png',
                    alt: 'Houden'
                  })
                )
              ),
              preact.h(
                'li',
                {
                  className: 'b-folio__item',
                  style: { backgroundColor: '#993300' } },
                preact.h(
                  'a',
                  {
                    className: 'b-folio__link',
                    href: '/2014/05/07/responsive-design-for-uwe-wittwer/' },
                  preact.h(
                    'span',
                    { className: 'b-folio__label' },
                    'Uwe Wittwer'
                  ),
                  preact.h('img', {
                    className: 'b-folio__image',
                    src: '/assets/img/portfolio/uwewittwer.png',
                    alt: 'Uwe Wittwer'
                  })
                )
              ),
              preact.h(
                'li',
                {
                  className: 'b-folio__item',
                  style: { backgroundColor: '#b72817' } },
                preact.h(
                  'a',
                  {
                    className: 'b-folio__link',
                    href: '/2016/10/10/building-a-shopify-theme/' },
                  preact.h(
                    'span',
                    { className: 'b-folio__label' },
                    'Shopify Theme'
                  ),
                  preact.h('img', {
                    className: 'b-folio__image',
                    src: '/assets/img/portfolio/stshopify.png',
                    alt: 'Building a Shopify Theme'
                  })
                )
              ),
              preact.h(
                'li',
                {
                  className: 'b-folio__item',
                  style: { backgroundColor: '#f05b26' } },
                preact.h(
                  'a',
                  {
                    className: 'b-folio__link',
                    href: '/2016/01/04/css-framework-for-partsgiant/' },
                  preact.h(
                    'span',
                    { className: 'b-folio__label' },
                    'PartsGiant'
                  ),
                  preact.h('img', {
                    className: 'b-folio__image',
                    src: '/assets/img/portfolio/partsgiant.jpg',
                    alt: 'PartsGiant'
                  })
                )
              ),
              preact.h(
                'li',
                {
                  className: 'b-folio__item',
                  style: { backgroundColor: '#5798da' } },
                preact.h(
                  'a',
                  {
                    className: 'b-folio__link',
                    href: '/2014/02/17/introducing-tales/' },
                  preact.h(
                    'span',
                    { className: 'b-folio__label' },
                    'Tales'
                  ),
                  preact.h('img', {
                    className: 'b-folio__image',
                    src: '/assets/img/portfolio/tales.jpg',
                    alt: 'Tales'
                  })
                )
              )
            )
          ),
          preact.h('br', null),
          preact.h(
            'h2',
            null,
            'Graphic Design'
          ),
          preact.h(
            'p',
            null,
            'Print, advertising, and editorial \u2014 these projects from my university degree helped develop my understanding of fundamental design principles.'
          ),
          preact.h(
            'div',
            { className: 'b-folio' },
            preact.h(
              'ul',
              { className: 'b-folio__list' },
              preact.h(
                'li',
                {
                  className: 'b-folio__item',
                  style: { backgroundColor: '#45b0e5' } },
                preact.h(
                  'a',
                  {
                    className: 'b-folio__link',
                    href: '/showcase/origami-unfolded/' },
                  preact.h(
                    'span',
                    { className: 'b-folio__label' },
                    'Origami Unfolded'
                  ),
                  preact.h('img', {
                    className: 'b-folio__image',
                    src: '/assets/img/portfolio/origami.jpg',
                    alt: 'Origami Unfolded'
                  })
                )
              ),
              preact.h(
                'li',
                {
                  className: 'b-folio__item',
                  style: { backgroundColor: '#661f1f' } },
                preact.h(
                  'a',
                  { className: 'b-folio__link', href: '/showcase/machinal/' },
                  preact.h(
                    'span',
                    { className: 'b-folio__label' },
                    'Machinal'
                  ),
                  preact.h('img', {
                    className: 'b-folio__image',
                    src: '/assets/img/portfolio/machinal.jpg',
                    alt: 'Machinal'
                  })
                )
              ),
              preact.h(
                'li',
                {
                  className: 'b-folio__item',
                  style: { backgroundColor: '#e57300' } },
                preact.h(
                  'a',
                  { className: 'b-folio__link', href: '/showcase/space-opera/' },
                  preact.h(
                    'span',
                    { className: 'b-folio__label' },
                    'Space Opera'
                  ),
                  preact.h('img', {
                    className: 'b-folio__image',
                    src: '/assets/img/portfolio/space.jpg',
                    alt: 'Space Opera'
                  })
                )
              ),
              preact.h(
                'li',
                {
                  className: 'b-folio__item',
                  style: { backgroundColor: '#e5c72e' } },
                preact.h(
                  'a',
                  { className: 'b-folio__link', href: '/showcase/seized/' },
                  preact.h(
                    'span',
                    { className: 'b-folio__label' },
                    'Seized'
                  ),
                  preact.h('img', {
                    className: 'b-folio__image',
                    src: '/assets/img/portfolio/seized.jpg',
                    alt: 'Seized'
                  })
                )
              ),
              preact.h(
                'li',
                {
                  className: 'b-folio__item',
                  style: { backgroundColor: '#47b247' } },
                preact.h(
                  'a',
                  {
                    className: 'b-folio__link',
                    href: '/showcase/digital-legibility/' },
                  preact.h(
                    'span',
                    { className: 'b-folio__label' },
                    'Digital Legibility'
                  ),
                  preact.h('img', {
                    className: 'b-folio__image',
                    src: '/assets/img/portfolio/digital.jpg',
                    alt: 'Digital Legibility'
                  })
                )
              ),
              preact.h(
                'li',
                {
                  className: 'b-folio__item',
                  style: { backgroundColor: '#3c3c3c' } },
                preact.h(
                  'a',
                  {
                    className: 'b-folio__link',
                    href: '/showcase/tamed-aggression/' },
                  preact.h(
                    'span',
                    { className: 'b-folio__label' },
                    'Tamed Aggression'
                  ),
                  preact.h('img', {
                    className: 'b-folio__image',
                    src: '/assets/img/portfolio/tamed.jpg',
                    alt: 'Tamed Aggression'
                  })
                )
              )
            )
          ),
          preact.h('hr', { id: 'more' }),
          preact.h(
            'h2',
            null,
            'Older Website Projects'
          ),
          preact.h(
            'p',
            null,
            'Web design and front-end development from previous agencies I\u2019ve worked at.'
          ),
          preact.h(
            'ul',
            null,
            preact.h(
              'li',
              null,
              preact.h(
                'a',
                { href: '/2013/08/09/responsive-design-for-kings-transfer/' },
                'King\u2019s Transfer'
              )
            ),
            preact.h(
              'li',
              null,
              preact.h(
                'a',
                { href: '/2012/06/17/passenger-focus-responsive-web-design-case-study/' },
                'Passenger Focus'
              )
            ),
            preact.h(
              'li',
              null,
              preact.h(
                'a',
                { href: '/2013/01/28/gloople-responsive-design-review/' },
                'Gloople'
              )
            ),
            preact.h(
              'li',
              null,
              preact.h(
                'a',
                { href: '/showcase/atherton-cox/' },
                'Atherton Cox'
              )
            ),
            preact.h(
              'li',
              null,
              preact.h(
                'a',
                { href: '/showcase/brucar/' },
                'Brucar'
              )
            ),
            preact.h(
              'li',
              null,
              preact.h(
                'a',
                { href: '/showcase/eden-anglo-french/' },
                'Eden Anglo French'
              )
            ),
            preact.h(
              'li',
              null,
              preact.h(
                'a',
                { href: '/showcase/my-life-listed/' },
                'MyLifeListed'
              )
            ),
            preact.h(
              'li',
              null,
              preact.h(
                'a',
                { href: '/showcase/peerless-av-europe/' },
                'Peerless AV Europe'
              )
            ),
            preact.h(
              'li',
              null,
              preact.h(
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
      return preact.h(
        'div',
        null,
        preact.h(el, pageProps),
        preact.h(Footer, null),
        preact.h(Nav, { pagePath: pagePath$$1 })
      );
    }
  }]);
  return Root;
}(Component);

function bootApp() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initProps;

  $app.innerHTML = '';
  docEl.classList.add('js-app');
  preact.render(preact.h(Root, props), $app);
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
