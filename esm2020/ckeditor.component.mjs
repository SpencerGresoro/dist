/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */
import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { getEditorNamespace } from 'ckeditor4-integrations-common';
import * as i0 from "@angular/core";
export class CKEditorComponent {
    constructor(elementRef, ngZone) {
        this.elementRef = elementRef;
        this.ngZone = ngZone;
        /**
         * CKEditor 4 script url address. Script will be loaded only if CKEDITOR namespace is missing.
         *
         * Defaults to 'https://cdn.ckeditor.com/4.24.0-lts/standard-all/ckeditor.js'
         */
        this.editorUrl = 'https://cdn.ckeditor.com/4.24.0-lts/standard-all/ckeditor.js';
        /**
         * Tag name of the editor component.
         *
         * The default tag is `textarea`.
         */
        this.tagName = 'textarea';
        /**
         * The type of the editor interface.
         *
         * By default editor interface will be initialized as `classic` editor.
         * You can also choose to create an editor with `inline` interface type instead.
         *
         * See https://ckeditor.com/docs/ckeditor4/latest/guide/dev_uitypes.html
         * and https://ckeditor.com/docs/ckeditor4/latest/examples/fixedui.html
         * to learn more.
         */
        this.type = "classic" /* CLASSIC */;
        /**
         * Fired when the CKEDITOR https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR.html namespace
         * is loaded. It only triggers once, no matter how many CKEditor 4 components are initialised.
         * Can be used for convenient changes in the namespace, e.g. for adding external plugins.
         */
        this.namespaceLoaded = new EventEmitter();
        /**
         * Fires when the editor is ready. It corresponds with the `editor#instanceReady`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-instanceReady
         * event.
         */
        this.ready = new EventEmitter();
        /**
         * Fires when the editor data is loaded, e.g. after calling setData()
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#method-setData
         * editor's method. It corresponds with the `editor#dataReady`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-dataReady event.
         */
        this.dataReady = new EventEmitter();
        /**
         * Fires when the content of the editor has changed. It corresponds with the `editor#change`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-change
         * event. For performance reasons this event may be called even when data didn't really changed.
         * Please note that this event will only be fired when `undo` plugin is loaded. If you need to
         * listen for editor changes (e.g. for two-way data binding), use `dataChange` event instead.
         */
        this.change = new EventEmitter();
        /**
         * Fires when the content of the editor has changed. In contrast to `change` - only emits when
         * data really changed thus can be successfully used with `[data]` and two way `[(data)]` binding.
         *
         * See more: https://angular.io/guide/template-syntax#two-way-binding---
         */
        this.dataChange = new EventEmitter();
        /**
         * Fires when the native dragStart event occurs. It corresponds with the `editor#dragstart`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-dragstart
         * event.
         */
        this.dragStart = new EventEmitter();
        /**
         * Fires when the native dragEnd event occurs. It corresponds with the `editor#dragend`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-dragend
         * event.
         */
        this.dragEnd = new EventEmitter();
        /**
         * Fires when the native drop event occurs. It corresponds with the `editor#drop`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-drop
         * event.
         */
        this.drop = new EventEmitter();
        /**
         * Fires when the file loader response is received. It corresponds with the `editor#fileUploadResponse`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-fileUploadResponse
         * event.
         */
        this.fileUploadResponse = new EventEmitter();
        /**
         * Fires when the file loader should send XHR. It corresponds with the `editor#fileUploadRequest`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-fileUploadRequest
         * event.
         */
        this.fileUploadRequest = new EventEmitter();
        /**
         * Fires when the editing area of the editor is focused. It corresponds with the `editor#focus`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-focus
         * event.
         */
        this.focus = new EventEmitter();
        /**
         * Fires after the user initiated a paste action, but before the data is inserted.
         * It corresponds with the `editor#paste`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-paste
         * event.
         */
        this.paste = new EventEmitter();
        /**
         * Fires after the `paste` event if content was modified. It corresponds with the `editor#afterPaste`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-afterPaste
         * event.
         */
        this.afterPaste = new EventEmitter();
        /**
         * Fires when the editing view of the editor is blurred. It corresponds with the `editor#blur`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-blur
         * event.
         */
        this.blur = new EventEmitter();
        /**
         * If the component is read–only before the editor instance is created, it remembers that state,
         * so the editor can become read–only once it is ready.
         */
        this._readOnly = null;
        this._data = null;
        this._destroyed = false;
    }
    /**
     * Keeps track of the editor's data.
     *
     * It's also decorated as an input which is useful when not using the ngModel.
     *
     * See https://angular.io/api/forms/NgModel to learn more.
     */
    set data(data) {
        if (data === this._data) {
            return;
        }
        if (this.instance) {
            this.instance.setData(data);
            // Data may be changed by ACF.
            this._data = this.instance.getData();
            return;
        }
        this._data = data;
    }
    get data() {
        return this._data;
    }
    /**
     * When set to `true`, the editor becomes read-only.
     *
     * See https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#property-readOnly
     * to learn more.
     */
    set readOnly(isReadOnly) {
        if (this.instance) {
            this.instance.setReadOnly(isReadOnly);
            return;
        }
        // Delay setting read-only state until editor initialization.
        this._readOnly = isReadOnly;
    }
    get readOnly() {
        if (this.instance) {
            return this.instance.readOnly;
        }
        return this._readOnly;
    }
    ngAfterViewInit() {
        getEditorNamespace(this.editorUrl, namespace => {
            this.namespaceLoaded.emit(namespace);
        }).then(() => {
            // Check if component instance was destroyed before `ngAfterViewInit` call (#110).
            // Here, `this.instance` is still not initialized and so additional flag is needed.
            if (this._destroyed) {
                return;
            }
            this.ngZone.runOutsideAngular(this.createEditor.bind(this));
        }).catch(window.console.error);
    }
    ngOnDestroy() {
        this._destroyed = true;
        this.ngZone.runOutsideAngular(() => {
            if (this.instance) {
                this.instance.destroy();
                this.instance = null;
            }
        });
    }
    writeValue(value) {
        this.data = value;
    }
    registerOnChange(callback) {
        this.onChange = callback;
    }
    registerOnTouched(callback) {
        this.onTouched = callback;
    }
    createEditor() {
        const element = document.createElement(this.tagName);
        const elementId = this.elementRef.nativeElement.id;
        // if the user has specified an id on the node in which they're initializing on, use that ID as the name of the editor!
        if (elementId) {
            element.id = elementId;
        }
        this.elementRef.nativeElement.appendChild(element);
        const userInstanceReadyCallback = this.config?.on?.instanceReady;
        const defaultConfig = {
            delayIfDetached: true
        };
        const config = { ...defaultConfig, ...this.config };
        if (typeof config.on === 'undefined') {
            config.on = {};
        }
        config.on.instanceReady = evt => {
            const editor = evt.editor;
            this.instance = editor;
            // Read only state may change during instance initialization.
            this.readOnly = this._readOnly !== null ? this._readOnly : this.instance.readOnly;
            this.subscribe(this.instance);
            const undo = editor.undoManager;
            if (this.data !== null) {
                undo && undo.lock();
                editor.setData(this.data, { callback: () => {
                        // Locking undoManager prevents 'change' event.
                        // Trigger it manually to updated bound data.
                        if (this.data !== editor.getData()) {
                            undo ? editor.fire('change') : editor.fire('dataReady');
                        }
                        undo && undo.unlock();
                        this.ngZone.run(() => {
                            if (typeof userInstanceReadyCallback === 'function') {
                                userInstanceReadyCallback(evt);
                            }
                            this.ready.emit(evt);
                        });
                    } });
            }
            else {
                this.ngZone.run(() => {
                    if (typeof userInstanceReadyCallback === 'function') {
                        userInstanceReadyCallback(evt);
                    }
                    this.ready.emit(evt);
                });
            }
        };
        if (this.type === "inline" /* INLINE */) {
            CKEDITOR.inline(element, config);
        }
        else {
            CKEDITOR.replace(element, config);
        }
    }
    subscribe(editor) {
        editor.on('focus', evt => {
            this.ngZone.run(() => {
                this.focus.emit(evt);
            });
        });
        editor.on('paste', evt => {
            this.ngZone.run(() => {
                this.paste.emit(evt);
            });
        });
        editor.on('afterPaste', evt => {
            this.ngZone.run(() => {
                this.afterPaste.emit(evt);
            });
        });
        editor.on('dragend', evt => {
            this.ngZone.run(() => {
                this.dragEnd.emit(evt);
            });
        });
        editor.on('dragstart', evt => {
            this.ngZone.run(() => {
                this.dragStart.emit(evt);
            });
        });
        editor.on('drop', evt => {
            this.ngZone.run(() => {
                this.drop.emit(evt);
            });
        });
        editor.on('fileUploadRequest', evt => {
            this.ngZone.run(() => {
                this.fileUploadRequest.emit(evt);
            });
        });
        editor.on('fileUploadResponse', evt => {
            this.ngZone.run(() => {
                this.fileUploadResponse.emit(evt);
            });
        });
        editor.on('blur', evt => {
            this.ngZone.run(() => {
                if (this.onTouched) {
                    this.onTouched();
                }
                this.blur.emit(evt);
            });
        });
        editor.on('dataReady', this.propagateChange, this);
        if (this.instance.undoManager) {
            editor.on('change', this.propagateChange, this);
        }
        // If 'undo' plugin is not loaded, listen to 'selectionCheck' event instead. (#54).
        else {
            editor.on('selectionCheck', this.propagateChange, this);
        }
    }
    propagateChange(event) {
        this.ngZone.run(() => {
            const newData = this.instance.getData();
            if (event.name === 'change') {
                this.change.emit(event);
            }
            else if (event.name === 'dataReady') {
                this.dataReady.emit(event);
            }
            if (newData === this.data) {
                return;
            }
            this._data = newData;
            this.dataChange.emit(newData);
            if (this.onChange) {
                this.onChange(newData);
            }
        });
    }
}
CKEditorComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: CKEditorComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
CKEditorComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.4.0", type: CKEditorComponent, selector: "ckeditor", inputs: { config: "config", editorUrl: "editorUrl", tagName: "tagName", type: "type", data: "data", readOnly: "readOnly" }, outputs: { namespaceLoaded: "namespaceLoaded", ready: "ready", dataReady: "dataReady", change: "change", dataChange: "dataChange", dragStart: "dragStart", dragEnd: "dragEnd", drop: "drop", fileUploadResponse: "fileUploadResponse", fileUploadRequest: "fileUploadRequest", focus: "focus", paste: "paste", afterPaste: "afterPaste", blur: "blur" }, providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CKEditorComponent),
            multi: true,
        }
    ], ngImport: i0, template: '<ng-template></ng-template>', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: CKEditorComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ckeditor',
                    template: '<ng-template></ng-template>',
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => CKEditorComponent),
                            multi: true,
                        }
                    ]
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { config: [{
                type: Input
            }], editorUrl: [{
                type: Input
            }], tagName: [{
                type: Input
            }], type: [{
                type: Input
            }], data: [{
                type: Input
            }], readOnly: [{
                type: Input
            }], namespaceLoaded: [{
                type: Output
            }], ready: [{
                type: Output
            }], dataReady: [{
                type: Output
            }], change: [{
                type: Output
            }], dataChange: [{
                type: Output
            }], dragStart: [{
                type: Output
            }], dragEnd: [{
                type: Output
            }], drop: [{
                type: Output
            }], fileUploadResponse: [{
                type: Output
            }], fileUploadRequest: [{
                type: Output
            }], focus: [{
                type: Output
            }], paste: [{
                type: Output
            }], afterPaste: [{
                type: Output
            }], blur: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2tlZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NrZWRpdG9yL2NrZWRpdG9yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQ04sU0FBUyxFQUVULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLFVBQVUsRUFHVixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBRU4saUJBQWlCLEVBQ2pCLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEIsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sK0JBQStCLENBQUM7O0FBa0JuRSxNQUFNLE9BQU8saUJBQWlCO0lBMk43QixZQUFxQixVQUFzQixFQUFVLE1BQWM7UUFBOUMsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFsTm5FOzs7O1dBSUc7UUFDTSxjQUFTLEdBQUcsOERBQThELENBQUM7UUFFcEY7Ozs7V0FJRztRQUNNLFlBQU8sR0FBRyxVQUFVLENBQUM7UUFFOUI7Ozs7Ozs7OztXQVNHO1FBQ00sU0FBSSwyQkFBc0Q7UUFvRG5FOzs7O1dBSUc7UUFDTyxvQkFBZSxHQUFHLElBQUksWUFBWSxFQUF1QixDQUFDO1FBRXBFOzs7O1dBSUc7UUFDTyxVQUFLLEdBQUcsSUFBSSxZQUFZLEVBQXVCLENBQUM7UUFFMUQ7Ozs7O1dBS0c7UUFDTyxjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQXVCLENBQUM7UUFFOUQ7Ozs7OztXQU1HO1FBQ08sV0FBTSxHQUFHLElBQUksWUFBWSxFQUF1QixDQUFDO1FBRTNEOzs7OztXQUtHO1FBQ08sZUFBVSxHQUFHLElBQUksWUFBWSxFQUF1QixDQUFDO1FBRS9EOzs7O1dBSUc7UUFDTyxjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQXVCLENBQUM7UUFFOUQ7Ozs7V0FJRztRQUNPLFlBQU8sR0FBRyxJQUFJLFlBQVksRUFBdUIsQ0FBQztR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TUFBTTtnQkFPRyxTQUFTO3NCQUFsQixNQUFNO2dCQU9HLE9BQU87c0JBQWhCLE1BQU07Z0JBT0csSUFBSTtzQkFBYixNQUFNO2dCQU9HLGtCQUFrQjtzQkFBM0IsTUFBTTtnQkFPRyxpQkFBaUI7c0JBQTFCLE1BQU07Z0JBT0csS0FBSztzQkFBZCxNQUFNO2dCQVFHLEtBQUs7c0JBQWQsTUFBTTtnQkFPRyxVQUFVO3NCQUFuQixNQUFNO2dCQU9HLElBQUk7c0JBQWIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDMtMjAyMywgQ0tTb3VyY2UgSG9sZGluZyBzcC4geiBvLm8uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqIEZvciBsaWNlbnNpbmcsIHNlZSBMSUNFTlNFLm1kLlxyXG4gKi9cclxuXHJcbmltcG9ydCB7XHJcblx0Q29tcG9uZW50LFxyXG5cdE5nWm9uZSxcclxuXHRJbnB1dCxcclxuXHRPdXRwdXQsXHJcblx0RXZlbnRFbWl0dGVyLFxyXG5cdGZvcndhcmRSZWYsXHJcblx0RWxlbWVudFJlZixcclxuXHRBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3lcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7XHJcblx0Q29udHJvbFZhbHVlQWNjZXNzb3IsXHJcblx0TkdfVkFMVUVfQUNDRVNTT1JcclxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcblxyXG5pbXBvcnQgeyBnZXRFZGl0b3JOYW1lc3BhY2UgfSBmcm9tICdja2VkaXRvcjQtaW50ZWdyYXRpb25zLWNvbW1vbic7XHJcblxyXG5pbXBvcnQgeyBDS0VkaXRvcjQgfSBmcm9tICcuL2NrZWRpdG9yJztcclxuXHJcbmRlY2xhcmUgbGV0IENLRURJVE9SOiBhbnk7XHJcblxyXG5AQ29tcG9uZW50KCB7XHJcblx0c2VsZWN0b3I6ICdja2VkaXRvcicsXHJcblx0dGVtcGxhdGU6ICc8bmctdGVtcGxhdGU+PC9uZy10ZW1wbGF0ZT4nLFxyXG5cclxuXHRwcm92aWRlcnM6IFtcclxuXHRcdHtcclxuXHRcdFx0cHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXHJcblx0XHRcdHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCAoKSA9PiBDS0VkaXRvckNvbXBvbmVudCApLFxyXG5cdFx0XHRtdWx0aTogdHJ1ZSxcclxuXHRcdH1cclxuXHRdXHJcbn0gKVxyXG5leHBvcnQgY2xhc3MgQ0tFZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcclxuXHQvKipcclxuXHQgKiBUaGUgY29uZmlndXJhdGlvbiBvZiB0aGUgZWRpdG9yLlxyXG5cdCAqXHJcblx0ICogU2VlIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfY29uZmlnLmh0bWxcclxuXHQgKiB0byBsZWFybiBtb3JlLlxyXG5cdCAqL1xyXG5cdEBJbnB1dCgpIGNvbmZpZz86IENLRWRpdG9yNC5Db25maWc7XHJcblxyXG5cdC8qKlxyXG5cdCAqIENLRWRpdG9yIDQgc2NyaXB0IHVybCBhZGRyZXNzLiBTY3JpcHQgd2lsbCBiZSBsb2FkZWQgb25seSBpZiBDS0VESVRPUiBuYW1lc3BhY2UgaXMgbWlzc2luZy5cclxuXHQgKlxyXG5cdCAqIERlZmF1bHRzIHRvICdodHRwczovL2Nkbi5ja2VkaXRvci5jb20vNC4yNC4wLWx0cy9zdGFuZGFyZC1hbGwvY2tlZGl0b3IuanMnXHJcblx0ICovXHJcblx0QElucHV0KCkgZWRpdG9yVXJsID0gJ2h0dHBzOi8vY2RuLmNrZWRpdG9yLmNvbS80LjI0LjAtbHRzL3N0YW5kYXJkLWFsbC9ja2VkaXRvci5qcyc7XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRhZyBuYW1lIG9mIHRoZSBlZGl0b3IgY29tcG9uZW50LlxyXG5cdCAqXHJcblx0ICogVGhlIGRlZmF1bHQgdGFnIGlzIGB0ZXh0YXJlYWAuXHJcblx0ICovXHJcblx0QElucHV0KCkgdGFnTmFtZSA9ICd0ZXh0YXJlYSc7XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoZSB0eXBlIG9mIHRoZSBlZGl0b3IgaW50ZXJmYWNlLlxyXG5cdCAqXHJcblx0ICogQnkgZGVmYXVsdCBlZGl0b3IgaW50ZXJmYWNlIHdpbGwgYmUgaW5pdGlhbGl6ZWQgYXMgYGNsYXNzaWNgIGVkaXRvci5cclxuXHQgKiBZb3UgY2FuIGFsc28gY2hvb3NlIHRvIGNyZWF0ZSBhbiBlZGl0b3Igd2l0aCBgaW5saW5lYCBpbnRlcmZhY2UgdHlwZSBpbnN0ZWFkLlxyXG5cdCAqXHJcblx0ICogU2VlIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9ndWlkZS9kZXZfdWl0eXBlcy5odG1sXHJcblx0ICogYW5kIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9leGFtcGxlcy9maXhlZHVpLmh0bWxcclxuXHQgKiB0byBsZWFybiBtb3JlLlxyXG5cdCAqL1xyXG5cdEBJbnB1dCgpIHR5cGU6IENLRWRpdG9yNC5FZGl0b3JUeXBlID0gQ0tFZGl0b3I0LkVkaXRvclR5cGUuQ0xBU1NJQztcclxuXHJcblx0LyoqXHJcblx0ICogS2VlcHMgdHJhY2sgb2YgdGhlIGVkaXRvcidzIGRhdGEuXHJcblx0ICpcclxuXHQgKiBJdCdzIGFsc28gZGVjb3JhdGVkIGFzIGFuIGlucHV0IHdoaWNoIGlzIHVzZWZ1bCB3aGVuIG5vdCB1c2luZyB0aGUgbmdNb2RlbC5cclxuXHQgKlxyXG5cdCAqIFNlZSBodHRwczovL2FuZ3VsYXIuaW8vYXBpL2Zvcm1zL05nTW9kZWwgdG8gbGVhcm4gbW9yZS5cclxuXHQgKi9cclxuXHRASW5wdXQoKSBzZXQgZGF0YSggZGF0YTogc3RyaW5nICkge1xyXG5cdFx0aWYgKCBkYXRhID09PSB0aGlzLl9kYXRhICkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCB0aGlzLmluc3RhbmNlICkge1xyXG5cdFx0XHR0aGlzLmluc3RhbmNlLnNldERhdGEoIGRhdGEgKTtcclxuXHRcdFx0Ly8gRGF0YSBtYXkgYmUgY2hhbmdlZCBieSBBQ0YuXHJcblx0XHRcdHRoaXMuX2RhdGEgPSB0aGlzLmluc3RhbmNlLmdldERhdGEoKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2RhdGEgPSBkYXRhO1xyXG5cdH1cclxuXHJcblx0Z2V0IGRhdGEoKTogc3RyaW5nIHtcclxuXHRcdHJldHVybiB0aGlzLl9kYXRhO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogV2hlbiBzZXQgdG8gYHRydWVgLCB0aGUgZWRpdG9yIGJlY29tZXMgcmVhZC1vbmx5LlxyXG5cdCAqXHJcblx0ICogU2VlIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjcHJvcGVydHktcmVhZE9ubHlcclxuXHQgKiB0byBsZWFybiBtb3JlLlxyXG5cdCAqL1xyXG5cdEBJbnB1dCgpIHNldCByZWFkT25seSggaXNSZWFkT25seTogYm9vbGVhbiApIHtcclxuXHRcdGlmICggdGhpcy5pbnN0YW5jZSApIHtcclxuXHRcdFx0dGhpcy5pbnN0YW5jZS5zZXRSZWFkT25seSggaXNSZWFkT25seSApO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRGVsYXkgc2V0dGluZyByZWFkLW9ubHkgc3RhdGUgdW50aWwgZWRpdG9yIGluaXRpYWxpemF0aW9uLlxyXG5cdFx0dGhpcy5fcmVhZE9ubHkgPSBpc1JlYWRPbmx5O1xyXG5cdH1cclxuXHJcblx0Z2V0IHJlYWRPbmx5KCk6IGJvb2xlYW4ge1xyXG5cdFx0aWYgKCB0aGlzLmluc3RhbmNlICkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5pbnN0YW5jZS5yZWFkT25seTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcy5fcmVhZE9ubHk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBGaXJlZCB3aGVuIHRoZSBDS0VESVRPUiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SLmh0bWwgbmFtZXNwYWNlXHJcblx0ICogaXMgbG9hZGVkLiBJdCBvbmx5IHRyaWdnZXJzIG9uY2UsIG5vIG1hdHRlciBob3cgbWFueSBDS0VkaXRvciA0IGNvbXBvbmVudHMgYXJlIGluaXRpYWxpc2VkLlxyXG5cdCAqIENhbiBiZSB1c2VkIGZvciBjb252ZW5pZW50IGNoYW5nZXMgaW4gdGhlIG5hbWVzcGFjZSwgZS5nLiBmb3IgYWRkaW5nIGV4dGVybmFsIHBsdWdpbnMuXHJcblx0ICovXHJcblx0QE91dHB1dCgpIG5hbWVzcGFjZUxvYWRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcclxuXHJcblx0LyoqXHJcblx0ICogRmlyZXMgd2hlbiB0aGUgZWRpdG9yIGlzIHJlYWR5LiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2luc3RhbmNlUmVhZHlgXHJcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1pbnN0YW5jZVJlYWR5XHJcblx0ICogZXZlbnQuXHJcblx0ICovXHJcblx0QE91dHB1dCgpIHJlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xyXG5cclxuXHQvKipcclxuXHQgKiBGaXJlcyB3aGVuIHRoZSBlZGl0b3IgZGF0YSBpcyBsb2FkZWQsIGUuZy4gYWZ0ZXIgY2FsbGluZyBzZXREYXRhKClcclxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI21ldGhvZC1zZXREYXRhXHJcblx0ICogZWRpdG9yJ3MgbWV0aG9kLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2RhdGFSZWFkeWBcclxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWRhdGFSZWFkeSBldmVudC5cclxuXHQgKi9cclxuXHRAT3V0cHV0KCkgZGF0YVJlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xyXG5cclxuXHQvKipcclxuXHQgKiBGaXJlcyB3aGVuIHRoZSBjb250ZW50IG9mIHRoZSBlZGl0b3IgaGFzIGNoYW5nZWQuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjY2hhbmdlYFxyXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtY2hhbmdlXHJcblx0ICogZXZlbnQuIEZvciBwZXJmb3JtYW5jZSByZWFzb25zIHRoaXMgZXZlbnQgbWF5IGJlIGNhbGxlZCBldmVuIHdoZW4gZGF0YSBkaWRuJ3QgcmVhbGx5IGNoYW5nZWQuXHJcblx0ICogUGxlYXNlIG5vdGUgdGhhdCB0aGlzIGV2ZW50IHdpbGwgb25seSBiZSBmaXJlZCB3aGVuIGB1bmRvYCBwbHVnaW4gaXMgbG9hZGVkLiBJZiB5b3UgbmVlZCB0b1xyXG5cdCAqIGxpc3RlbiBmb3IgZWRpdG9yIGNoYW5nZXMgKGUuZy4gZm9yIHR3by13YXkgZGF0YSBiaW5kaW5nKSwgdXNlIGBkYXRhQ2hhbmdlYCBldmVudCBpbnN0ZWFkLlxyXG5cdCAqL1xyXG5cdEBPdXRwdXQoKSBjaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XHJcblxyXG5cdC8qKlxyXG5cdCAqIEZpcmVzIHdoZW4gdGhlIGNvbnRlbnQgb2YgdGhlIGVkaXRvciBoYXMgY2hhbmdlZC4gSW4gY29udHJhc3QgdG8gYGNoYW5nZWAgLSBvbmx5IGVtaXRzIHdoZW5cclxuXHQgKiBkYXRhIHJlYWxseSBjaGFuZ2VkIHRodXMgY2FuIGJlIHN1Y2Nlc3NmdWxseSB1c2VkIHdpdGggYFtkYXRhXWAgYW5kIHR3byB3YXkgYFsoZGF0YSldYCBiaW5kaW5nLlxyXG5cdCAqXHJcblx0ICogU2VlIG1vcmU6IGh0dHBzOi8vYW5ndWxhci5pby9ndWlkZS90ZW1wbGF0ZS1zeW50YXgjdHdvLXdheS1iaW5kaW5nLS0tXHJcblx0ICovXHJcblx0QE91dHB1dCgpIGRhdGFDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XHJcblxyXG5cdC8qKlxyXG5cdCAqIEZpcmVzIHdoZW4gdGhlIG5hdGl2ZSBkcmFnU3RhcnQgZXZlbnQgb2NjdXJzLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2RyYWdzdGFydGBcclxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWRyYWdzdGFydFxyXG5cdCAqIGV2ZW50LlxyXG5cdCAqL1xyXG5cdEBPdXRwdXQoKSBkcmFnU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XHJcblxyXG5cdC8qKlxyXG5cdCAqIEZpcmVzIHdoZW4gdGhlIG5hdGl2ZSBkcmFnRW5kIGV2ZW50IG9jY3Vycy4gSXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgYGVkaXRvciNkcmFnZW5kYFxyXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtZHJhZ2VuZFxyXG5cdCAqIGV2ZW50LlxyXG5cdCAqL1xyXG5cdEBPdXRwdXQoKSBkcmFnRW5kID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xyXG5cclxuXHQvKipcclxuXHQgKiBGaXJlcyB3aGVuIHRoZSBuYXRpdmUgZHJvcCBldmVudCBvY2N1cnMuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjZHJvcGBcclxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWRyb3BcclxuXHQgKiBldmVudC5cclxuXHQgKi9cclxuXHRAT3V0cHV0KCkgZHJvcCA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcclxuXHJcblx0LyoqXHJcblx0ICogRmlyZXMgd2hlbiB0aGUgZmlsZSBsb2FkZXIgcmVzcG9uc2UgaXMgcmVjZWl2ZWQuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjZmlsZVVwbG9hZFJlc3BvbnNlYFxyXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtZmlsZVVwbG9hZFJlc3BvbnNlXHJcblx0ICogZXZlbnQuXHJcblx0ICovXHJcblx0QE91dHB1dCgpIGZpbGVVcGxvYWRSZXNwb25zZSA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcclxuXHJcblx0LyoqXHJcblx0ICogRmlyZXMgd2hlbiB0aGUgZmlsZSBsb2FkZXIgc2hvdWxkIHNlbmQgWEhSLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2ZpbGVVcGxvYWRSZXF1ZXN0YFxyXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtZmlsZVVwbG9hZFJlcXVlc3RcclxuXHQgKiBldmVudC5cclxuXHQgKi9cclxuXHRAT3V0cHV0KCkgZmlsZVVwbG9hZFJlcXVlc3QgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XHJcblxyXG5cdC8qKlxyXG5cdCAqIEZpcmVzIHdoZW4gdGhlIGVkaXRpbmcgYXJlYSBvZiB0aGUgZWRpdG9yIGlzIGZvY3VzZWQuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjZm9jdXNgXHJcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1mb2N1c1xyXG5cdCAqIGV2ZW50LlxyXG5cdCAqL1xyXG5cdEBPdXRwdXQoKSBmb2N1cyA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcclxuXHJcblx0LyoqXHJcblx0ICogRmlyZXMgYWZ0ZXIgdGhlIHVzZXIgaW5pdGlhdGVkIGEgcGFzdGUgYWN0aW9uLCBidXQgYmVmb3JlIHRoZSBkYXRhIGlzIGluc2VydGVkLlxyXG5cdCAqIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjcGFzdGVgXHJcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1wYXN0ZVxyXG5cdCAqIGV2ZW50LlxyXG5cdCAqL1xyXG5cdEBPdXRwdXQoKSBwYXN0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcclxuXHJcblx0LyoqXHJcblx0ICogRmlyZXMgYWZ0ZXIgdGhlIGBwYXN0ZWAgZXZlbnQgaWYgY29udGVudCB3YXMgbW9kaWZpZWQuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjYWZ0ZXJQYXN0ZWBcclxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWFmdGVyUGFzdGVcclxuXHQgKiBldmVudC5cclxuXHQgKi9cclxuXHRAT3V0cHV0KCkgYWZ0ZXJQYXN0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcclxuXHJcblx0LyoqXHJcblx0ICogRmlyZXMgd2hlbiB0aGUgZWRpdGluZyB2aWV3IG9mIHRoZSBlZGl0b3IgaXMgYmx1cnJlZC4gSXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgYGVkaXRvciNibHVyYFxyXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtYmx1clxyXG5cdCAqIGV2ZW50LlxyXG5cdCAqL1xyXG5cdEBPdXRwdXQoKSBibHVyID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xyXG5cclxuXHQvKipcclxuXHQgKiBBIGNhbGxiYWNrIGV4ZWN1dGVkIHdoZW4gdGhlIGNvbnRlbnQgb2YgdGhlIGVkaXRvciBjaGFuZ2VzLiBQYXJ0IG9mIHRoZVxyXG5cdCAqIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgKGh0dHBzOi8vYW5ndWxhci5pby9hcGkvZm9ybXMvQ29udHJvbFZhbHVlQWNjZXNzb3IpIGludGVyZmFjZS5cclxuXHQgKlxyXG5cdCAqIE5vdGU6IFVuc2V0IHVubGVzcyB0aGUgY29tcG9uZW50IHVzZXMgdGhlIGBuZ01vZGVsYC5cclxuXHQgKi9cclxuXHRvbkNoYW5nZT86ICggZGF0YTogc3RyaW5nICkgPT4gdm9pZDtcclxuXHJcblx0LyoqXHJcblx0ICogQSBjYWxsYmFjayBleGVjdXRlZCB3aGVuIHRoZSBlZGl0b3IgaGFzIGJlZW4gYmx1cnJlZC4gUGFydCBvZiB0aGVcclxuXHQgKiBgQ29udHJvbFZhbHVlQWNjZXNzb3JgIChodHRwczovL2FuZ3VsYXIuaW8vYXBpL2Zvcm1zL0NvbnRyb2xWYWx1ZUFjY2Vzc29yKSBpbnRlcmZhY2UuXHJcblx0ICpcclxuXHQgKiBOb3RlOiBVbnNldCB1bmxlc3MgdGhlIGNvbXBvbmVudCB1c2VzIHRoZSBgbmdNb2RlbGAuXHJcblx0ICovXHJcblx0b25Ub3VjaGVkPzogKCkgPT4gdm9pZDtcclxuXHJcblx0LyoqXHJcblx0ICogVGhlIGluc3RhbmNlIG9mIHRoZSBlZGl0b3IgY3JlYXRlZCBieSB0aGlzIGNvbXBvbmVudC5cclxuXHQgKi9cclxuXHRpbnN0YW5jZTogYW55O1xyXG5cclxuXHQvKipcclxuXHQgKiBJZiB0aGUgY29tcG9uZW50IGlzIHJlYWTigJNvbmx5IGJlZm9yZSB0aGUgZWRpdG9yIGluc3RhbmNlIGlzIGNyZWF0ZWQsIGl0IHJlbWVtYmVycyB0aGF0IHN0YXRlLFxyXG5cdCAqIHNvIHRoZSBlZGl0b3IgY2FuIGJlY29tZSByZWFk4oCTb25seSBvbmNlIGl0IGlzIHJlYWR5LlxyXG5cdCAqL1xyXG5cdHByaXZhdGUgX3JlYWRPbmx5OiBib29sZWFuID0gbnVsbDtcclxuXHJcblx0cHJpdmF0ZSBfZGF0YTogc3RyaW5nID0gbnVsbDtcclxuXHJcblx0cHJpdmF0ZSBfZGVzdHJveWVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIHByaXZhdGUgbmdab25lOiBOZ1pvbmUgKSB7fVxyXG5cclxuXHRuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XHJcblx0XHRnZXRFZGl0b3JOYW1lc3BhY2UoIHRoaXMuZWRpdG9yVXJsLCBuYW1lc3BhY2UgPT4ge1xyXG5cdFx0XHR0aGlzLm5hbWVzcGFjZUxvYWRlZC5lbWl0KCBuYW1lc3BhY2UgKTtcclxuXHRcdH0gKS50aGVuKCAoKSA9PiB7XHJcblx0XHRcdC8vIENoZWNrIGlmIGNvbXBvbmVudCBpbnN0YW5jZSB3YXMgZGVzdHJveWVkIGJlZm9yZSBgbmdBZnRlclZpZXdJbml0YCBjYWxsICgjMTEwKS5cclxuXHRcdFx0Ly8gSGVyZSwgYHRoaXMuaW5zdGFuY2VgIGlzIHN0aWxsIG5vdCBpbml0aWFsaXplZCBhbmQgc28gYWRkaXRpb25hbCBmbGFnIGlzIG5lZWRlZC5cclxuXHRcdFx0aWYgKCB0aGlzLl9kZXN0cm95ZWQgKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhciggdGhpcy5jcmVhdGVFZGl0b3IuYmluZCggdGhpcyApICk7XHJcblx0XHR9ICkuY2F0Y2goIHdpbmRvdy5jb25zb2xlLmVycm9yICk7XHJcblx0fVxyXG5cclxuXHRuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuXHRcdHRoaXMuX2Rlc3Ryb3llZCA9IHRydWU7XHJcblxyXG5cdFx0dGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoICgpID0+IHtcclxuXHRcdFx0aWYgKCB0aGlzLmluc3RhbmNlICkge1xyXG5cdFx0XHRcdHRoaXMuaW5zdGFuY2UuZGVzdHJveSgpO1xyXG5cdFx0XHRcdHRoaXMuaW5zdGFuY2UgPSBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHR9ICk7XHJcblx0fVxyXG5cclxuXHR3cml0ZVZhbHVlKCB2YWx1ZTogc3RyaW5nICk6IHZvaWQge1xyXG5cdFx0dGhpcy5kYXRhID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHRyZWdpc3Rlck9uQ2hhbmdlKCBjYWxsYmFjazogKCBkYXRhOiBzdHJpbmcgKSA9PiB2b2lkICk6IHZvaWQge1xyXG5cdFx0dGhpcy5vbkNoYW5nZSA9IGNhbGxiYWNrO1xyXG5cdH1cclxuXHJcblx0cmVnaXN0ZXJPblRvdWNoZWQoIGNhbGxiYWNrOiAoKSA9PiB2b2lkICk6IHZvaWQge1xyXG5cdFx0dGhpcy5vblRvdWNoZWQgPSBjYWxsYmFjaztcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgY3JlYXRlRWRpdG9yKCk6IHZvaWQge1xyXG5cdFx0Y29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIHRoaXMudGFnTmFtZSApO1xyXG4gICAgICAgIGNvbnN0IGVsZW1lbnRJZCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmlkO1xyXG5cclxuICAgICAgICAvLyBpZiB0aGUgdXNlciBoYXMgc3BlY2lmaWVkIGFuIGlkIG9uIHRoZSBub2RlIGluIHdoaWNoIHRoZXkncmUgaW5pdGlhbGl6aW5nIG9uLCB1c2UgdGhhdCBJRCBhcyB0aGUgbmFtZSBvZiB0aGUgZWRpdG9yIVxyXG4gICAgICAgIGlmICggZWxlbWVudElkICkge1xyXG4gICAgICAgICAgICBlbGVtZW50LmlkID0gZWxlbWVudElkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuXHRcdHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFwcGVuZENoaWxkKCBlbGVtZW50ICk7XHJcblxyXG5cdFx0Y29uc3QgdXNlckluc3RhbmNlUmVhZHlDYWxsYmFjayA9IHRoaXMuY29uZmlnPy5vbj8uaW5zdGFuY2VSZWFkeTtcclxuXHRcdGNvbnN0IGRlZmF1bHRDb25maWc6IFBhcnRpYWw8Q0tFZGl0b3I0LkNvbmZpZz4gPSB7XHJcblx0XHRcdGRlbGF5SWZEZXRhY2hlZDogdHJ1ZVxyXG5cdFx0fTtcclxuXHRcdGNvbnN0IGNvbmZpZzogUGFydGlhbDxDS0VkaXRvcjQuQ29uZmlnPiA9IHsgLi4uZGVmYXVsdENvbmZpZywgLi4udGhpcy5jb25maWcgfTtcclxuXHJcblx0XHRpZiAoIHR5cGVvZiBjb25maWcub24gPT09ICd1bmRlZmluZWQnICkge1xyXG5cdFx0XHRjb25maWcub24gPSB7fTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25maWcub24uaW5zdGFuY2VSZWFkeSA9IGV2dCA9PiB7XHJcblx0XHRcdGNvbnN0IGVkaXRvciA9IGV2dC5lZGl0b3I7XHJcblxyXG5cdFx0XHR0aGlzLmluc3RhbmNlID0gZWRpdG9yO1xyXG5cclxuXHRcdFx0Ly8gUmVhZCBvbmx5IHN0YXRlIG1heSBjaGFuZ2UgZHVyaW5nIGluc3RhbmNlIGluaXRpYWxpemF0aW9uLlxyXG5cdFx0XHR0aGlzLnJlYWRPbmx5ID0gdGhpcy5fcmVhZE9ubHkgIT09IG51bGwgPyB0aGlzLl9yZWFkT25seSA6IHRoaXMuaW5zdGFuY2UucmVhZE9ubHk7XHJcblxyXG5cdFx0XHR0aGlzLnN1YnNjcmliZSggdGhpcy5pbnN0YW5jZSApO1xyXG5cclxuXHRcdFx0Y29uc3QgdW5kbyA9IGVkaXRvci51bmRvTWFuYWdlcjtcclxuXHJcblx0XHRcdGlmICggdGhpcy5kYXRhICE9PSBudWxsICkge1xyXG5cdFx0XHRcdHVuZG8gJiYgdW5kby5sb2NrKCk7XHJcblxyXG5cdFx0XHRcdGVkaXRvci5zZXREYXRhKCB0aGlzLmRhdGEsIHsgY2FsbGJhY2s6ICgpID0+IHtcclxuXHRcdFx0XHRcdC8vIExvY2tpbmcgdW5kb01hbmFnZXIgcHJldmVudHMgJ2NoYW5nZScgZXZlbnQuXHJcblx0XHRcdFx0XHQvLyBUcmlnZ2VyIGl0IG1hbnVhbGx5IHRvIHVwZGF0ZWQgYm91bmQgZGF0YS5cclxuXHRcdFx0XHRcdGlmICggdGhpcy5kYXRhICE9PSBlZGl0b3IuZ2V0RGF0YSgpICkge1xyXG5cdFx0XHRcdFx0XHR1bmRvID8gZWRpdG9yLmZpcmUoICdjaGFuZ2UnICkgOiBlZGl0b3IuZmlyZSggJ2RhdGFSZWFkeScgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHVuZG8gJiYgdW5kby51bmxvY2soKTtcclxuXHJcblx0XHRcdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcclxuXHRcdFx0XHRcdFx0aWYgKCB0eXBlb2YgdXNlckluc3RhbmNlUmVhZHlDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0XHRcdFx0XHR1c2VySW5zdGFuY2VSZWFkeUNhbGxiYWNrKCBldnQgKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0dGhpcy5yZWFkeS5lbWl0KCBldnQgKTtcclxuXHRcdFx0XHRcdH0gKTtcclxuXHRcdFx0XHR9IH0gKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcclxuXHRcdFx0XHRcdGlmICggdHlwZW9mIHVzZXJJbnN0YW5jZVJlYWR5Q2FsbGJhY2sgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdFx0XHRcdHVzZXJJbnN0YW5jZVJlYWR5Q2FsbGJhY2soIGV2dCApO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHRoaXMucmVhZHkuZW1pdCggZXZ0ICk7XHJcblx0XHRcdFx0fSApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCB0aGlzLnR5cGUgPT09IENLRWRpdG9yNC5FZGl0b3JUeXBlLklOTElORSApIHtcclxuXHRcdFx0Q0tFRElUT1IuaW5saW5lKCBlbGVtZW50LCBjb25maWcgKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdENLRURJVE9SLnJlcGxhY2UoIGVsZW1lbnQsIGNvbmZpZyApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBzdWJzY3JpYmUoIGVkaXRvcjogYW55ICk6IHZvaWQge1xyXG5cdFx0ZWRpdG9yLm9uKCAnZm9jdXMnLCBldnQgPT4ge1xyXG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmZvY3VzLmVtaXQoIGV2dCApO1xyXG5cdFx0XHR9ICk7XHJcblx0XHR9ICk7XHJcblxyXG5cdFx0ZWRpdG9yLm9uKCAncGFzdGUnLCBldnQgPT4ge1xyXG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLnBhc3RlLmVtaXQoIGV2dCApO1xyXG5cdFx0XHR9ICk7XHJcblx0XHR9ICk7XHJcblxyXG5cdFx0ZWRpdG9yLm9uKCAnYWZ0ZXJQYXN0ZScsIGV2dCA9PiB7XHJcblx0XHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuYWZ0ZXJQYXN0ZS5lbWl0KCBldnQgKTtcclxuXHRcdFx0fSApO1xyXG5cdFx0fSApO1xyXG5cclxuXHRcdGVkaXRvci5vbiggJ2RyYWdlbmQnLCBldnQgPT4ge1xyXG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmRyYWdFbmQuZW1pdCggZXZ0ICk7XHJcblx0XHRcdH0gKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGVkaXRvci5vbiggJ2RyYWdzdGFydCcsIGV2dCA9PiB7XHJcblx0XHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuZHJhZ1N0YXJ0LmVtaXQoIGV2dCApO1xyXG5cdFx0XHR9ICk7XHJcblx0XHR9ICk7XHJcblxyXG5cdFx0ZWRpdG9yLm9uKCAnZHJvcCcsIGV2dCA9PiB7XHJcblx0XHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuZHJvcC5lbWl0KCBldnQgKTtcclxuXHRcdFx0fSApO1xyXG5cdFx0fSApO1xyXG5cclxuXHRcdGVkaXRvci5vbiggJ2ZpbGVVcGxvYWRSZXF1ZXN0JywgZXZ0ID0+IHtcclxuXHRcdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5maWxlVXBsb2FkUmVxdWVzdC5lbWl0KGV2dCk7XHJcblx0XHRcdH0gKTtcclxuXHRcdH0gKTtcclxuXHJcblx0XHRlZGl0b3Iub24oICdmaWxlVXBsb2FkUmVzcG9uc2UnLCBldnQgPT4ge1xyXG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmZpbGVVcGxvYWRSZXNwb25zZS5lbWl0KGV2dCk7XHJcblx0XHRcdH0gKTtcclxuXHRcdH0gKTtcclxuXHJcblx0XHRlZGl0b3Iub24oICdibHVyJywgZXZ0ID0+IHtcclxuXHRcdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XHJcblx0XHRcdFx0aWYgKCB0aGlzLm9uVG91Y2hlZCApIHtcclxuXHRcdFx0XHRcdHRoaXMub25Ub3VjaGVkKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aGlzLmJsdXIuZW1pdCggZXZ0ICk7XHJcblx0XHRcdH0gKTtcclxuXHRcdH0gKTtcclxuXHJcblx0XHRlZGl0b3Iub24oICdkYXRhUmVhZHknLCB0aGlzLnByb3BhZ2F0ZUNoYW5nZSwgdGhpcyApO1xyXG5cclxuXHRcdGlmICggdGhpcy5pbnN0YW5jZS51bmRvTWFuYWdlciApIHtcclxuXHRcdFx0ZWRpdG9yLm9uKCAnY2hhbmdlJywgdGhpcy5wcm9wYWdhdGVDaGFuZ2UsIHRoaXMgKTtcclxuXHRcdH1cclxuXHRcdC8vIElmICd1bmRvJyBwbHVnaW4gaXMgbm90IGxvYWRlZCwgbGlzdGVuIHRvICdzZWxlY3Rpb25DaGVjaycgZXZlbnQgaW5zdGVhZC4gKCM1NCkuXHJcblx0XHRlbHNlIHtcclxuXHRcdFx0ZWRpdG9yLm9uKCAnc2VsZWN0aW9uQ2hlY2snLCB0aGlzLnByb3BhZ2F0ZUNoYW5nZSwgdGhpcyApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBwcm9wYWdhdGVDaGFuZ2UoIGV2ZW50OiBhbnkgKTogdm9pZCB7XHJcblx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcclxuXHRcdFx0Y29uc3QgbmV3RGF0YSA9IHRoaXMuaW5zdGFuY2UuZ2V0RGF0YSgpO1xyXG5cclxuXHRcdFx0aWYgKCBldmVudC5uYW1lID09PSAnY2hhbmdlJyApIHtcclxuXHRcdFx0XHR0aGlzLmNoYW5nZS5lbWl0KCBldmVudCApO1xyXG5cdFx0XHR9IGVsc2UgaWYgKCBldmVudC5uYW1lID09PSAnZGF0YVJlYWR5JyApIHtcclxuXHRcdFx0XHR0aGlzLmRhdGFSZWFkeS5lbWl0KCBldmVudCApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIG5ld0RhdGEgPT09IHRoaXMuZGF0YSApIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuX2RhdGEgPSBuZXdEYXRhO1xyXG5cdFx0XHR0aGlzLmRhdGFDaGFuZ2UuZW1pdCggbmV3RGF0YSApO1xyXG5cclxuXHRcdFx0aWYgKCB0aGlzLm9uQ2hhbmdlICkge1xyXG5cdFx0XHRcdHRoaXMub25DaGFuZ2UoIG5ld0RhdGEgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSApO1xyXG5cdH1cclxuXHJcbn1cclxuIl19