import browser from '../browser';

import { ExternallyManagedKeyHandler } from './ExternallyManagedKeyHandler';
import { ManagedKeyHandler } from './ManagedKeyHandler';
import { OlmAdapter } from './OlmAdapter';

/**
 * This module integrates {@link KeyHandler} with {@link JitsiConference} in order to enable E2E encryption.
 */
export class E2EEncryption {
    /**
     * A constructor.
     * @param {JitsiConference} conference - The conference instance for which E2E encryption is to be enabled.
     */
    constructor(conference) {
        const { e2ee = {} } = conference.options.config;

        this._externallyManaged = e2ee.externallyManagedKey;

        // #TODO: Freddy, this has been removed in the most recent version of jitsi
        // this.conference.on(
        //     JitsiConferenceEvents.CONFERENCE_JOINED,
        //     () => {
        //         this._conferenceJoined = true;
        //     });
        // this.conference.on(
        //     JitsiConferenceEvents.PARTICIPANT_PROPERTY_CHANGED,
        //     this._onParticipantPropertyChanged.bind(this));

        // #TODO: Freddy, this has been removed in the most recent version of jitsi
        // this.conference.on(
        //     JitsiConferenceEvents.USER_JOINED,
        //     this._onParticipantJoined.bind(this));
        // this.conference.on(
        //     JitsiConferenceEvents.USER_LEFT,
        //     this._onParticipantLeft.bind(this));

        // Conference media events in order to attach the encryptor / decryptor.
        // FIXME add events to TraceablePeerConnection which will allow to see when there's new receiver or sender
        // added instead of shenanigans around conference track events and track muted.
        //

        // #TODO: Freddy, this has been removed in the most recent version of jitsi
        // this.conference.on(
        //     JitsiConferenceEvents._MEDIA_SESSION_STARTED,
        //     this._onMediaSessionStarted.bind(this));
        // this.conference.on(
        //     JitsiConferenceEvents.TRACK_ADDED,
        //     track => track.isLocal() && this._onLocalTrackAdded(track));
        // this.conference.rtc.on(
        //     RTCEvents.REMOTE_TRACK_ADDED,
        //     (track, tpc) => this._setupReceiverE2EEForTrack(tpc, track));
        // this.conference.on(
        //     JitsiConferenceEvents.TRACK_MUTE_CHANGED,
        //     this._trackMuteChanged.bind(this));

        // // Olm signalling events.
        // this._olmAdapter.on(
        //     OlmAdapter.events.OLM_ID_KEY_READY,
        //     this._onOlmIdKeyReady.bind(this));
        // this._olmAdapter.on(
        //     OlmAdapter.events.PARTICIPANT_E2EE_CHANNEL_READY,
        //     this._onParticipantE2EEChannelReady.bind(this));
        // this._olmAdapter.on(
        //     OlmAdapter.events.PARTICIPANT_KEY_UPDATED,
        //     this._onParticipantKeyUpdated.bind(this));

        if (this._externallyManaged) {
            this._keyHandler = new ExternallyManagedKeyHandler(conference);
        } else {
            this._keyHandler = new ManagedKeyHandler(conference);
        }
    }

    /**
     * Indicates if E2EE is supported in the current platform.
     *
     * @param {object} config - Global configuration.
     * @returns {boolean}
     */
    static isSupported(config) {
        // #TODO: Freddy, this has been removed in the most recent version of jitsi
        // console.log(config);
        // console.log('config');
        // console.debug(`browser.supportsInsertableStreams(): ${browser.supportsInsertableStreams()}`);
        // console.debug(`OlmAdapter.isSupported(): ${OlmAdapter.isSupported()}`);
        // console.debug(`!(config.testing && config.testing.disableE2EE): ${!(config.testing && config.testing.disableE2EE)}`);

        // const supportsInsertable = browser.supportsInsertableStreams();
        // const olmSupported = OlmAdapter.isSupported();
        // const testing = !(config.testing && config.testing.disableE2EE);

        // return supportsInsertable && olmSupported && testing;
        const { e2ee = {} } = config;

        if (!e2ee.externallyManagedKey && !OlmAdapter.isSupported()) {
            return false;
        }

        return !(config.testing && config.testing.disableE2EE)
            && (browser.supportsInsertableStreams()
                || (config.enableEncodedTransformSupport && browser.supportsEncodedTransform()));
    }

    /**
     * Indicates whether E2EE is currently enabled or not.
     *
     * @returns {boolean}
     */
    isEnabled() {
        return this._keyHandler.isEnabled();
    }

    /**
     * Enables / disables End-To-End encryption.
     *
     * @param {boolean} enabled - whether E2EE should be enabled or not.
     * @returns {void}
     */
    async setEnabled(enabled) {
        await this._keyHandler.setEnabled(enabled);
    }

    /**
     * Sets the key and index for End-to-End encryption.
     *
     * @param {CryptoKey} [keyInfo.encryptionKey] - encryption key.
     * @param {Number} [keyInfo.index] - the index of the encryption key.
     * @returns {void}
     */
    setEncryptionKey(keyInfo) {
        this._keyHandler.setKey(keyInfo);
    }
}
