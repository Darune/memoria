
#include "quantum.h"
#include "print.h"
#include "raw_hid.h"

#define ML_LED_1(status) writePin(B6, (bool)status)
#define ML_LED_2(status) writePin(B2, (bool)status)
#define ML_LED_3(status) writePin(B3, (bool)status)
#define ML_LED_4(status) writePin(B1, (bool)status)

const uint16_t PROGMEM refresh_combo[] = {KC_H, KC_J, KC_K, KC_L, COMBO_END};

combo_t key_combos[COMBO_COUNT] = {
    COMBO(refresh_combo, LCTL(KC_R)),
};

void keyboard_pre_init_user(void) {
    setPinOutput(B6);
    setPinOutput(B2);
    setPinOutput(B3);
    setPinOutput(B1);
}
bool led_states[4] = {false, false, false, false};
uint8_t led_pins[4] = {B6, B2, B3, B1};

void raw_hid_receive(uint8_t *data, uint8_t length) {
    dprint("hid_receive\n");
    // uprintf("received %i, %i %i", length, data[0], data[1]);
    // raw_hid_send(data, length);
    if (data[0] == 0) {
        ML_LED_1(false);
        ML_LED_2(false);
        ML_LED_3(false);
        ML_LED_4(false);
        led_states[0] = false;
        led_states[1] = false;
        led_states[2] = false;
        led_states[3] = false;
    } else if (data[0] == 1) {
        int ledNum = (int) data[1];
        bool newState = (bool) data[2] == 1;
        writePin(led_pins[ledNum], newState);
        led_states[ledNum] = newState;
    }
    // Your code goes here. data is the packet received from host.
}

bool process_record_user(uint16_t keycode, keyrecord_t *record) {
    switch (keycode) {
        case KC_H:
            // if (record->event.pressed) {
            //     ML_LED_1(!led_states[0]);
            //     led_states[0] = !led_states[0];
            // }
            return true;
        default:
            return true; // Process all other keycodes normally
    }
}

void keyboard_post_init_user(void) {
  // Customise these values to desired behaviour
//   debug_enable=true;
//   debug_matrix=true;
//   debug_keyboard=true;
  //debug_mouse=true;
}
