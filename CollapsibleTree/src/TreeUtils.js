/**
 * TreeUtils.js
 *
 * Some helper functions and constants for the collapsible tree lens.
 */
'use strict';

const ONE = 1;
const ABS_PATH_SEP = '.';
const ABS_PATH_OR_NAME_SEP = /[.|]/;

const statuses = {
  Critical: 'Critical',
  Invalid: 'Invalid',
  Timeout: 'Timeout',
  Warning: 'Warning',
  Info: 'Info',
  OK: 'OK',
};

function moreSevere(a, b) {
  if (statuses[a] === undefined || statuses[b] === undefined) {
    return statuses.Invalid;
  }

  const vals = {
    Critical: 0,
    Invalid: 1,
    Timeout: 2,
    Warning: 3,
    Info: 4,
    OK: 5,
  };
  return vals[a] < vals[b] ? a : b;
} // moreSevere

/**
 * Recursive function rolls up the severest status to parent and renames
 * sample's "value" attribute to "sampleValue" since d3 "partition" assigns
 * its own attribute named "value".
 *
 * @param {Object} n - A node in the subject hierarchy
 * @returns {Object} - the updated subject hierarchy
 */
function prepareHierarchyData(n) { // eslint-disable-line max-statements
  if (n.status === undefined) {
    n.status = statuses.OK;
  }

  if (n.children) {
    const kids = [];
    n.children.forEach((kid) => {
      const k = prepareHierarchyData(kid);
      kids.push(k);
      n.status = moreSevere(n.status, k.status);
    });
    n.children = kids;
  }

  if (n.samples) {
    const samples = {};
    const sampleKeys = Object.keys(n.samples);
    for (let j = 0; j < sampleKeys.length; j++) {
      n.status = moreSevere(n.status, n.samples[sampleKeys[j]].status);
      samples[sampleKeys[j]] = n.samples[sampleKeys[j]];
      samples[sampleKeys[j]].sampleValue = samples[sampleKeys[j]].value;
    }

    n.samples = samples;
  }

  return n;
} // prepareHierarchyData

function childrenize(n) {
  if (n.children) {
    n.children.forEach(childrenize);
  } else {
    n.children = [];
  }

  if (n.samples && typeof n.samples === 'object') {
    const sampleKeys = Object.keys(n.samples);
    for (let i = 0; i < sampleKeys.length; i++) {
      n.children.push(n.samples[sampleKeys[i]]);
    }
  }

  return n;
} // childrenize

module.exports = {
  statuses,

  /**
   * Clone object.
   *
   * @param  {Object} obj - Object to copy
   * @returns {Object} copy - New copied object
   */
  clone(obj) {
    let copy;

    // Handle simple types, and null or undefined
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (let i = 0, len = obj.length; i < len; i++) {
        copy[i] = this.clone(obj[i]);
      }

      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      Object.keys(obj).forEach((attr) => {
        if (obj.hasOwnProperty(attr)) {
          copy[attr] = this.clone(obj[attr]);
        }
      });

      return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
  },

  /**
   * Returns the absolutePath of the parent of the subject or sample
   * represented by the specified key.
   *
   * @param {String} key - subject.absolutePath or sample.name
   * @returns {String} - the absolutePath of the parent
   */
  getParentAbsolutePath(key) {
    const arr = key.split(ABS_PATH_OR_NAME_SEP);
    arr.pop();
    return arr.join(ABS_PATH_SEP);
  }, // getParentAbsolutePath

  /**
   * Use this as the d3.partition children accessor function. It will return
   * an array of the subject's children and samples. It expects "children" and
   * "samples" to be arrays.
   *
   * @param {Object} n - node
   * @returns {Array} - the node's children and samples
   */
  nodeChildren(n) {
    const retval = n.children || [];
    if (n.samples && n.samples.length) {
      retval.concat(n.samples);
    }

    return retval;
  }, // nodeChildren

  /**
   * Use this as the d3.partition sort comparator function. It will sort by
   * subject or sample name in ascending order, case-insensitive.
   *
   * @param {Object} a - the first node to compare
   * @param {Object} b - the second node to compare
   * @returns {Integer} - positive integer if a > b, negative integer if
   *  a < b, 0 if a === b
   */
  nameAscending(a, b) {
    if (a && a.name && b && b.name) {
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return ONE;
      } else if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -ONE;
      }
    }

    return 0;
  }, // nameAscending

  prepareHierarchyData,
  childrenize,
}; // module.exports
