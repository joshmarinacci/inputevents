var KEYS = {
    BACK_DELETE:"BACK_DELETE",
    RIGHT:"RIGHT",
    LEFT:"LEFT",
    DOWN:'DOWN',
    UP:'UP',
    ENTER:'ENTER',
    BACK_DELETE:'BACK_DELETE',
    FORWARD_DELETE:'FORWARD_DELETE',
}


//for browser
var browsercodes_to_keys = {
    39:KEYS.RIGHT,
    37:'LEFT',
    40:'DOWN',
    38:'UP',
    8:'BACK_DELETE',
    46:'FORWARD_DELETE',
    13:'ENTER',
}

var aminocodes_to_keys = {
    286: KEYS.RIGHT,
    285: KEYS.LEFT,
    283: KEYS.UP,
    284: KEYS.DOWN,
    295: KEYS.BACK_DELETE,
    297: KEYS.FORWARD_DELETE,
    294: KEYS.ENTER,
}

exports.fromBrowserKeyboardEvent = function(evt) {
    console.log("processing browser event");
}

exports.fromAminoKeyboardEvent = function(evt) {
    //console.log("processing amino event",evt);
    //console.log("printable = ", evt.printableChar);
    var key = aminocodes_to_keys[evt.keycode];
    if(key) {
        return {
            recognized:true,
            key:key,
            shift:false,
            printable:false,
        }
    }


    if(evt.printable) {
        return {
            recognized:true,
            printable:evt.printable,
            char: evt.printableChar,
            shift: evt.shift,
        }
    }

    return {
        recognized:false,
    }


}

function cookKeyboardEvent(e) {
    if(codes_to_keys[e.keyCode]) {
        return {
            recognized:true,
            KEYS:KEYS,
            key: codes_to_keys[e.keyCode],
            printable:false,
            control:e.ctrlKey,
            shift:e.shiftKey,
            meta: e.metaKey,
        }
    }


    //American keyboard
    var shift_map = { };
    function insertMap(map, start, len, str) {
        for(var i=0; i<len; i++) {
            map[start+i] = str[i];
        }
    }
    insertMap(shift_map, 48,10, ')!@#$%^&*(');

    var codes_to_chars = {  32:' ', }
    function addKeysWithShift(start, str) {
        if(str.length % 2 != 0) throw new Error("not an even number of chars");
        for(var i=0; i<str.length/2; i++) {
            codes_to_chars[start+i] = str[i*2+0];
            shift_map[start+i] = str[i*2+1];
        }
    }
    addKeysWithShift(186,';:=+,<-_.>/?`~');
    addKeysWithShift(219,'[{\\|]}\'"');
    addKeysWithShift(48,'0)1!2@3#4$5%6^7&8*9(');
    // /console.log("keycode = ", e.keyCode);

    if(codes_to_chars[e.keyCode]) {
        var char = codes_to_chars[e.keyCode];
        if(e.shiftKey && shift_map[e.keyCode]) {
            char = shift_map[e.keyCode];
        }
        return {
            recognized:true,
            KEYS:KEYS,
            printable:true,
            char: char,
            control:e.ctrlKey,
            shift:e.shiftKey,
            meta: e.metaKey,
        }
    }

    //alphabet
    if(e.keyCode >= 65 && e.keyCode <= 90) {
        var char = String.fromCharCode(e.keyCode);
        if(e.shiftKey) {
            char = char.toUpperCase();
        } else {
            char = char.toLowerCase();
        }
        return {
            recognized:true,
            KEYS:KEYS,
            printable:true,
            char: char,
            control:e.ctrlKey,
            shift:e.shiftKey,
            meta: e.metaKey,
        }
    }
    return {
        recognized:false,
    }
}
