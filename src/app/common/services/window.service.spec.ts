import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BrowserWindowRef, windowFactory, WindowRef } from './window.service';

class BadWindowRef extends WindowRef { }

describe('window.service', () => {

    it('should throw error', () => {
        const w = new BadWindowRef();
        const getterCall = () => w.nativeWindow;
        expect(getterCall).toThrowError();
    });

    it('should return browser window', () => {
        const w = new BrowserWindowRef();
        expect(w.nativeWindow).toEqual(window);
    });

    it('windowFactory', () => {
        const w = new BrowserWindowRef();
        expect(windowFactory(w, TestBed.get(PLATFORM_ID))).toEqual(window);
        expect(windowFactory(null, 'any')).not.toEqual(window);
    });

});
