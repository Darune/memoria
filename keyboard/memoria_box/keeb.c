
#include "quantum.h"
#include "print.h"
#include "raw_hid.h"

#define ML_LED_1(status) writePin(B6, (bool)status)
#define ML_LED_2(status) writePin(B2, (bool)status)
#define ML_LED_3(status) writePin(B3, (bool)status)
#define ML_LED_4(status) writePin(B1, (bool)status)
#define ML_LED_5(status) writePin(B5, (bool)status)
#define ML_LED_6(status) writePin(B4, (bool)status)

const uint16_t PROGMEM refresh_combo[] = {KC_H, KC_J, KC_K, KC_L, COMBO_END};
const uint16_t PROGMEM enter_combo[] = {KC_U, KC_I, COMBO_END};

bool led_states[6] = {false, false, false, false, false, false};
uint8_t led_pins[6] = {B6, B2, B3, B1, B4, B6};
uint8_t letter_to_led_idx[6] = {KC_H, KC_J, KC_K, KC_L, KC_U, KC_I};

combo_t key_combos[COMBO_COUNT] = {
    COMBO(refresh_combo, LCTL(KC_R)),
    COMBO(enter_combo, KC_ENTER),
};

void set_led_status(uint8_t ledIdx, bool status) {
    writePin(led_pins[ledIdx], status);
}

uint8_t get_led_idx(uint16_t keycode) {
    for (uint8_t idx = 0;  idx < 6; idx++) {
        if (letter_to_led_idx[idx] == keycode) {
            return idx;
        }
    }
    return -1;
}

void keyboard_pre_init_user(void) {
    setPinOutput(B6);
    setPinOutput(B5);
    setPinOutput(B4);
    setPinOutput(B3);
    setPinOutput(B2);
    setPinOutput(B1);
}

void raw_hid_receive(uint8_t *data, uint8_t length) {
    if (data[0] == 0) {
        ML_LED_1(false);
        ML_LED_2(false);
        ML_LED_3(false);
        ML_LED_4(false);
        ML_LED_5(false);
        ML_LED_6(false);
        led_states[0] = false;
        led_states[1] = false;
        led_states[2] = false;
        led_states[3] = false;
        led_states[4] = false;
        led_states[5] = false;
    } else if (data[0] == 1) {
        bool newLedState = (bool) data[2] == 1;
        uint8_t ledNum = (uint8_t) data[1];
        set_led_status(ledNum, newLedState);
        led_states[ledNum] = newLedState;
    }
    // Your code goes here. data is the packet received from host.
}

bool process_record_user(uint16_t keycode, keyrecord_t *record) {
    uint8_t led_idx = get_led_idx(keycode);
    if (led_idx >= 0) {
        if (record->event.pressed) {
            set_led_status(led_idx, true);
        } else {
            set_led_status(led_idx, led_states[led_idx]);
        }
    }
    return true; // Process all other keycodes normally
}
