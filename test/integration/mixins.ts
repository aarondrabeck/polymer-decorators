/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */

declare function fixture(id: string): HTMLElement;


suite('Polymer Mixins', function() {

  let declarativeEventsTestElement: DeclarativeEventsMixinTestElement;
  let declarativeEventsTestElementExtended:
      DeclarativeEventsMixinTestElementExtended;

  setup(function() {
    declarativeEventsTestElement =
        fixture('declarative-events-mixin-test-element-fixture') as
        DeclarativeEventsMixinTestElement;
    declarativeEventsTestElementExtended =
        fixture('declarative-events-mixin-test-element-extended-fixture') as
        DeclarativeEventsMixinTestElementExtended;
  });

  suite('declarative events mixin', function() {

    test('listener registered on window', function() {
      // Arrange
      // Act
      window.dispatchEvent(new CustomEvent('tap', {bubbles: false}));

      // Assert
      chai.assert.equal(declarativeEventsTestElement.tapWindowCounter, 1);
    });

    test('listener registered on element by Id', function() {
      // Arrange
      const tapRegion =
          declarativeEventsTestElement.shadowRoot.querySelector('#tapRegion');

      // Act
      tapRegion.dispatchEvent(new CustomEvent('tap', {bubbles: false}));

      // Assert
      chai.assert.equal(declarativeEventsTestElement.tapElementByIdCounter, 1);
    });

  });

  suite('declarative events mixin inheritance tests', function() {

    test('base class listener on window', function() {
      // Arrange
      // Act
      window.dispatchEvent(new CustomEvent('tap', {bubbles: false}));

      // Assert
      chai.assert.equal(
          declarativeEventsTestElementExtended.tapWindowCounter, 1);
    });

    test('base class listener on element by Id', function() {
      // Arrange
      const tapRegion =
          declarativeEventsTestElementExtended.shadowRoot.querySelector(
              '#tapRegion');

      // Act
      tapRegion.dispatchEvent(new CustomEvent('tap', {bubbles: false}));

      // Assert
      chai.assert.equal(
          declarativeEventsTestElementExtended.tapElementByIdCounter, 1);
    });

    test('derived class listener', function() {
      // Arrange
      const target =
          declarativeEventsTestElementExtended.shadowRoot.querySelector(
              '#tapRegionExtended');

      // Act
      target.dispatchEvent(new CustomEvent('tap', {bubbles: false}));

      // Assert
      chai.assert.equal(
          declarativeEventsTestElementExtended.extendedRegionTapCounter, 1);
    });

  });

  suite('declarative events mixin handler not method', function() {

    var el;
    suiteSetup(function() {

      sinon.spy(console, 'warn');
      el = document.createElement(
          'declarative-events-mixin-invalid-test-element');
      document.body.appendChild(el);
    });

    suiteTeardown(function() {
      document.body.removeChild(el);
    });

    test('listener with invalid handler emits warning', function() {
      // Arrange
      var warn = console.warn as any;

      // Act
      // Assert
      chai.assert.isTrue(warn.calledOnce);
      var warnMessage = warn.firstCall.args[0];
      chai.assert.strictEqual(
          warnMessage,
          'Failed to register tap listener on invalidHandler handler.');
      warn.restore();
    });

  });

});
