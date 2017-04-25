/*:
 * @plugindesc Display texts above event
 * @author Rui
 *
 * *@help
 * Version: 1.3
 *
 * Plugin Command:
 *  SimpleText Write event text                         text_should_be_written_like_this.
 *
 *  SimpleText Setup event Duration value               value is time in second. 0 means persistent. default: 3
 *  SimpleText Setup event Top value                    default: 1
 *  SimpleText Setup event Left value                   default: 0.5
 *  SimpleText Setup event Font value                   default: GameFont
 *  SimpleText Setup event Size value                   default: 21
 *  SimpleText Setup event Italic value                 default: false
 *  SimpleText Setup event Color value                  default: #ffffff
 *  SimpleText Setup event OutlineWidth value           default: 2
 *  SimpleText Setup event OutlineColor value           default: rgba(0,0,0,0.5)
 *  SimpleText Setup event Alpha value                  default: 1
 *  SimpleText Setup event SlideUp value                default: false
 *  SimpleText Setup event SlideUpSpeed value           default: 0.05
 *  SimpleText Setup event SlideDown value              default: false
 *  SimpleText Setup event SlideDownSpeed value         default: 0.05
 *  SimpleText Setup event SlideLeft value              default: false
 *  SimpleText Setup event SlideLeftSpeed value         default: 0.05
 *  SimpleText Setup event SlideRight value             default: false
 *  SimpleText Setup event SlideRightSpeed value        default: 0.05
 *
 *  SimpleText Erase event                              remove all texts associated with this event.
 *
 * Note:
 *  Text will follow event.
 *
 *  Only need to setup a property once per event.
 *
 *  "event" can be event name or event id. To get current event, use 0. To get player, use -1.
 *
 *  Do not need to care about command capitalization.
 *
 *  eg. Display "Treasure Chest" above current event.
 *      SimpleText Write 0 Treasure_Chest
 *
 *  eg. This shows how to setup text.
 *      SimpleText Setup 0 SlideUp true
 *      SimpleText Write 0 default_font_size_is_21
 *      SimpleText Setup 0 Size 30
 *      SimpleText Write 0 now_font_size_is_30
 *      SimpleText Write 0 font_size_is_still_30
 *      SimpleText Write 0 30...
 *      SimpleText Setup 0 Size 21
 *      SimpleText Write 0 change_font_size_back_to_21
 
 *  eg. Display text above this character, which will slide up and then disappear after 2 seconds
 *      SimpleText Setup 0 Duration 2
 *      SimpleText Setup 0 SlideUp true
 *      SimpleText Setup 0 Color #ff0000
 *      SimpleText Write 0 -99999
 *
 *  eg. Health indicator hovering above character
 *      SimpleText Setup 0 Color #ff0000
 *      SimpleText Setup 0 Size 16
 *      SimpleText Setup 0 Left 0.8
 *      SimpleText Setup 0 Duration 0
 *      SimpleText Write 0 HP
 *
 *      SimpleText Setup 0 Color #ffffff
 *      SimpleText Setup 0 Size 16
 *      SimpleText Setup 0 Left 0.2
 *      SimpleText Setup 0 Duration 0
 *      SimpleText Write 0 91
 *
 *  License:
 *      Free for any game.
 */
 
(function() {
    /**
     * Text setting obj
     */
    function SimpleText_Setting() {
        //set default values here
        this.durationDefault = 180;
        this.topPosition = 1;
        this.leftPosition = 0.5;
        this.fontFace = 'GameFont';
        this.fontSize = 21;
        this.fontItalic = false;
        this.textColor = '#ffffff';
        this.outlineColor = 'rgba(0,0,0,0.5)';
        this.outlineWidth = 2;
        this.bitmapAlpha = 1;
        this.slideUp = false;
        this.slideUpSpeed = 0.05;
        this.slideDown = false;
        this.slideDownSpeed = 0.05;
        this.slideLeft = false;
        this.slideLeftSpeed = 0.05;
        this.slideRight = false;
        this.slideRightSpeed = 0.05;
    }
    /**
     * SimpleText_Sprite_Text object
     * display bitmap on screen
     */
    function SimpleText_Sprite_Text() {
        this.initialize.apply(this, arguments);
    }
    SimpleText_Sprite_Text.prototype = Object.create(Sprite.prototype);
    SimpleText_Sprite_Text.prototype.constructor = SimpleText_Sprite_Text;
    /**
     * initialize SimpleText_Sprite_Text
     */
    SimpleText_Sprite_Text.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this.initMembers();
    };
    SimpleText_Sprite_Text.prototype.initMembers = function() {
        this.uniqueID = null;
        this.bitmap = null;
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this.z = 9;
    };
    /**
     * SimpleTextObj
     * store text property and status
     */
    function SimpleTextObj(text, textSetting, uniqueID, realX, realY) {
        this.uniqueID = uniqueID;
        this.text = text;
        this.textSetting = textSetting;
        this.duration = textSetting.durationDefault;
        this.topPosition = textSetting.topPosition;
        this.leftPosition = textSetting.leftPosition;
        this.isPlaying = true;
        this.spriteCharacterHeight = null;
        this.realX = realX;
        this.realY = realY;
    }
    /**
     *
     * Modify Tilemap.prototype.update
     */
    var _Tilemap_update = Tilemap.prototype.update;
    Tilemap.prototype.update = function() {
        _Tilemap_update.call(this);
 
        var eventsLength = $gameMap._events.length;
 
        // loop through each event
        for (var s = 0; s < eventsLength; s++) {
            var event = $gameMap._events[s];
            if (!event)
                continue;
 
            if (event.simpleTextObjList && event.simpleTextObjList.length > 0) {
                var spriteCharacter = null;
                var simpleTextObjLength = event.simpleTextObjList.length;
 
                // loop through each simpleTextObject of event
                for (var i = simpleTextObjLength - 1; i >= 0; i--) {
                    var simpleTextObject =  event.simpleTextObjList[i];
 
                    var spriteText = null;
 
                    var tileMapChildrenLength = this.children.length;
 
                    // loop through each children of tileMap
                    for (var j = 0; j < tileMapChildrenLength; j++) {
                        if (spriteCharacter != null && spriteText != null)
                            break;
 
                        var sprite = this.children[j];
 
                        // find spriteCharacter of event
                        if (spriteCharacter == null && sprite._character && sprite._character == event)
                            spriteCharacter = sprite;
 
                        // find spriteText of simpleTextObj
                        if (spriteText == null && sprite.uniqueID && sprite.uniqueID == simpleTextObject.uniqueID)
                            spriteText = sprite;
                    }
 
                    if (simpleTextObject.isPlaying) {
                        // create spriteText if null
                        if (spriteText == null && spriteCharacter != null) {
                            // create SimpleText_Sprite_Text to display bitmap
                            spriteText = new SimpleText_Sprite_Text();
                            spriteText.uniqueID = simpleTextObject.uniqueID;
                            spriteText.anchor.x = simpleTextObject.leftPosition;
                            spriteText.anchor.y = simpleTextObject.topPosition;
                            spriteText.x = spriteCharacter.x;
                            simpleTextObject.spriteCharacterHeight = spriteCharacter.height;
                            spriteText.y = spriteCharacter.y - spriteCharacter.height;
                            var plusOutline = simpleTextObject.textSetting.outlineWidth * 2;
                            spriteText.bitmap = new Bitmap(simpleTextObject.textSetting.fontSize * simpleTextObject.text.length + plusOutline, simpleTextObject.textSetting.fontSize + plusOutline);
                            spriteText.bitmap.fontFace = simpleTextObject.textSetting.fontFace;
                            spriteText.bitmap.fontSize = simpleTextObject.textSetting.fontSize;
                            spriteText.bitmap.fontItalic = simpleTextObject.textSetting.fontItalic;
                            spriteText.bitmap.textColor = simpleTextObject.textSetting.textColor;
                            spriteText.bitmap.outlineColor = simpleTextObject.textSetting.outlineColor;
                            spriteText.bitmap.outlineWidth = simpleTextObject.textSetting.outlineWidth;
                            spriteText.bitmap._context.globalAlpha = simpleTextObject.textSetting.bitmapAlpha;
                            spriteText.bitmap.drawText(simpleTextObject.text, 0, 0, spriteText.bitmap.width, spriteText.bitmap.height, 'center');
 
                            this.addChild(spriteText);
                        }
 
                        // update spriteText position
                        if (spriteCharacter != null && spriteText != null) {
                            // to slide or not to slide
                            if (simpleTextObject.textSetting.slideUp == true) {
                                simpleTextObject.topPosition += simpleTextObject.textSetting.slideUpSpeed;
 
                                var scrolledX = $gameMap.adjustX(simpleTextObject.realX);
                                var scrolledY = $gameMap.adjustY(simpleTextObject.realY);
                                var tw = $gameMap.tileWidth();
                                var screenX = Math.round(scrolledX * tw + tw / 2);
                                var th = $gameMap.tileHeight();
                                var screenY = Math.round(scrolledY * th + th);
                                spriteText.x = screenX;
                                spriteText.y = screenY - spriteCharacter.height;
 
                                spriteText.anchor.x = simpleTextObject.leftPosition;
                                spriteText.anchor.y = simpleTextObject.topPosition;
                            }
                            else if (simpleTextObject.textSetting.slideDown == true) {
                                simpleTextObject.topPosition -= simpleTextObject.textSetting.slideDownSpeed;
 
                                var scrolledX = $gameMap.adjustX(simpleTextObject.realX);
                                var scrolledY = $gameMap.adjustY(simpleTextObject.realY);
                                var tw = $gameMap.tileWidth();
                                var screenX = Math.round(scrolledX * tw + tw / 2);
                                var th = $gameMap.tileHeight();
                                var screenY = Math.round(scrolledY * th + th);
                                spriteText.x = screenX;
                                spriteText.y = screenY - spriteCharacter.height;
 
                                spriteText.anchor.x = simpleTextObject.leftPosition;
                                spriteText.anchor.y = simpleTextObject.topPosition;
                            }
                            else if (simpleTextObject.textSetting.slideLeft == true) {
                                simpleTextObject.leftPosition += simpleTextObject.textSetting.slideLeftSpeed;
 
                                var scrolledX = $gameMap.adjustX(simpleTextObject.realX);
                                var scrolledY = $gameMap.adjustY(simpleTextObject.realY);
                                var tw = $gameMap.tileWidth();
                                var screenX = Math.round(scrolledX * tw + tw / 2);
                                var th = $gameMap.tileHeight();
                                var screenY = Math.round(scrolledY * th + th);
                                spriteText.x = screenX;
                                spriteText.y = screenY - spriteCharacter.height;
 
                                spriteText.anchor.x = simpleTextObject.leftPosition;
                                spriteText.anchor.y = simpleTextObject.topPosition;
                            }
                            else if (simpleTextObject.textSetting.slideRight == true) {
                                simpleTextObject.leftPosition -= simpleTextObject.textSetting.slideRightSpeed;
 
                                var scrolledX = $gameMap.adjustX(simpleTextObject.realX);
                                var scrolledY = $gameMap.adjustY(simpleTextObject.realY);
                                var tw = $gameMap.tileWidth();
                                var screenX = Math.round(scrolledX * tw + tw / 2);
                                var th = $gameMap.tileHeight();
                                var screenY = Math.round(scrolledY * th + th);
                                spriteText.x = screenX;
                                spriteText.y = screenY - spriteCharacter.height;
 
                                spriteText.anchor.x = simpleTextObject.leftPosition;
                                spriteText.anchor.y = simpleTextObject.topPosition;
                            }
                            else {
                                spriteText.x = spriteCharacter.x;
                                spriteText.y = spriteCharacter.y - spriteCharacter.height;
                            }
                        }
 
                        // check if persistent
                        if (simpleTextObject.duration != 0) {
                            simpleTextObject.duration--;
 
                            if (simpleTextObject.duration <= 0)
                                simpleTextObject.isPlaying = false;
                        }
                    }
 
                    if (!simpleTextObject.isPlaying) {
                        // clear spriteText
                        if (spriteText) {
                            this.removeChild(spriteText);
                            spriteText.bitmap = null;
                            spriteText = null;
                        }
 
                        // remove simpleTextObject from list
                        simpleTextObject.bitmap = null;
                        simpleTextObject = null;
                        event.simpleTextObjList.splice(i, 1);
                    }
                }
            }
        }
    };
    /**
     * Game_CharacterBase.prototype.initMembers
     */
    var _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function() {
        _Game_CharacterBase_initMembers.call(this);
 
        this.simpleTextObjList = [];                           // simepleTextObjs associated with this event
        this.simpleTextSetting = new SimpleText_Setting();     // text settings
    };
    /**
     * Game_CharacterBase.prototype.createText
     */
    Game_CharacterBase.prototype.createText = function(text) {
        var uniqueNumber = function() {
            if (!$gameMap.SimpleTextUniqueID) {
                $gameMap.SimpleTextUniqueID = 0;
            }
            $gameMap.SimpleTextUniqueID++;
            return $gameMap.SimpleTextUniqueID;
        };
 
        var newSimpleTextObj = new SimpleTextObj(text, this.simpleTextSetting, uniqueNumber(), this._realX, this._realY);
        this.simpleTextObjList.push(newSimpleTextObj);
    };
    /**
     * Game_CharacterBase.prototype.clearText
     */
    Game_CharacterBase.prototype.clearText = function() {
        var simpleTextObjLength = this.simpleTextObjList.length;
        for (var i = simpleTextObjLength - 1; i >= 0; i--)
            this.simpleTextObjList[i].isPlaying = false;
    };
    /**
     * get event by name
     */
    Game_Map.prototype.getEventByName = function(eventId) {
        var filtered = this.events().filter(function(e) {
            return e.event().name == eventId;
        });
 
        if (filtered.length > 0)
            return filtered[0];
        else
            return null;
    };
    /**
     * get event by id or name
     */
    Game_Interpreter.prototype.findEvent = function(eventId) {
        var event = null;
 
        //assume eventId
        if (!isNaN(eventId)) {
            event = this.character(eval(eventId));
            if (event != null)
                return event;
        }
 
        //if not eventId, try eventName
        event = $gameMap.getEventByName(eventId);
        return event;
    };
    /**
     * read plugin command
     */
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
 
        if (command.toUpperCase() == "SIMPLETEXT") {
            var subject = this.findEvent(args[1]);
            if (subject == null)
                return;
 
            if (args[0].toUpperCase() == "WRITE") {
                var text = args[2].replace(/_/g, ' ');
                subject.createText(text);
            }
            else if (args[0].toUpperCase() == "SETUP") {
                if (args[2].toUpperCase() == "DURATION") {
                    subject.simpleTextSetting.durationDefault = eval(args[3]) * 60;
                }
                else if (args[2].toUpperCase() == "TOP") {
                    subject.simpleTextSetting.topPosition = eval(args[3]);
                }
                else if (args[2].toUpperCase() == "LEFT") {
                    subject.simpleTextSetting.leftPosition = eval(args[3]);
                }
                else if (args[2].toUpperCase() == "FONT") {
                    subject.simpleTextSetting.fontFace = args[3];
                }
                else if (args[2].toUpperCase() == "SIZE") {
                    subject.simpleTextSetting.fontSize = eval(args[3]);
                }
                else if (args[2].toUpperCase() == "ITALIC") {
                    subject.simpleTextSetting.fontItalic = (args[3].toUpperCase() === "TRUE");
                }
                else if (args[2].toUpperCase() == "COLOR") {
                    subject.simpleTextSetting.textColor = args[3];
                }
                else if (args[2].toUpperCase() == "OUTLINEWIDTH") {
                    subject.simpleTextSetting.outlineWidth = eval(args[3]);
                }
                else if (args[2].toUpperCase() == "OUTLINECOLOR") {
                    subject.simpleTextSetting.outlineColor = args[3];
                }
                else if (args[2].toUpperCase() == "ALPHA") {
                    subject.simpleTextSetting.bitmapAlpha = eval(args[3]);
                }
                else if (args[2].toUpperCase() == "SLIDEUP") {
                    var b = args[3].toUpperCase() === "TRUE";
                    if (b) {
                        subject.simpleTextSetting.slideUp = true;
                        subject.simpleTextSetting.slideDown = false;
                        subject.simpleTextSetting.slideLeft = false;
                        subject.simpleTextSetting.slideRight = false;
                    }
                    else {
                        subject.simpleTextSetting.slideUp = false;
                    }
                }
                else if (args[2].toUpperCase() == "SLIDEUPSPEED") {
                    subject.simpleTextSetting.slideUpSpeed = eval(args[3]);
                }
                else if (args[2].toUpperCase() == "SLIDEDOWN") {
                    var b = args[3].toUpperCase() === "TRUE";
                    if (b) {
                        subject.simpleTextSetting.slideUp = false;
                        subject.simpleTextSetting.slideDown = true;
                        subject.simpleTextSetting.slideLeft = false;
                        subject.simpleTextSetting.slideRight = false;
                    }
                    else {
                        subject.simpleTextSetting.slideDown = false;
                    }
                }
                else if (args[2].toUpperCase() == "SLIDEDOWNSPEED") {
                    subject.simpleTextSetting.slideDownSpeed = eval(args[3]);
                }
                else if (args[2].toUpperCase() == "SLIDELEFT") {
                    var b = args[3].toUpperCase() === "TRUE";
                    if (b) {
                        subject.simpleTextSetting.slideLeft = true;
                        subject.simpleTextSetting.slideRight = false;
                        subject.simpleTextSetting.slideUp = false;
                        subject.simpleTextSetting.slideDown = false;
                    }
                    else {
                        subject.simpleTextSetting.slideLeft = false;
                    }
                }
                else if (args[2].toUpperCase() == "SLIDELEFTSPEED") {
                    subject.simpleTextSetting.slideLeftSpeed = eval(args[3]);
                }
                else if (args[2].toUpperCase() == "SLIDERIGHT") {
                    var b = args[3].toUpperCase() === "TRUE";
                    if (b) {
                        subject.simpleTextSetting.slideLeft = false;
                        subject.simpleTextSetting.slideRight = true;
                        subject.simpleTextSetting.slideUp = false;
                        subject.simpleTextSetting.slideDown = false;
                    }
                    else {
                        subject.simpleTextSetting.slideRight = false;
                    }
                }
                else if (args[2].toUpperCase() == "SLIDERIGHTSPEED") {
                    subject.simpleTextSetting.slideRightSpeed = eval(args[3]);
                }
            }
            else if (args[0].toUpperCase() == "ERASE") {
                subject.clearText();
            }
        }
    };
})();
