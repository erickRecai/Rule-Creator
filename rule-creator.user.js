// ==UserScript==
// @name         Rule Creator
// @namespace    https://github.com/erickRecai?tab=repositories
// @version      1.0.1
// @description  creates a basic regex rule from selected text.
// @author       guyRicky

// @match        *://*/*
// @noframes

// @exclude      *://docs.google.com/*

// @require      https://code.jquery.com/jquery-3.4.1.min.js

// @licence      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/
// @licence      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// ==/UserScript==
/* jshint esversion: 6 */

(function () {
    'use strict';

    if(0){/*
    last update: 3/3/2020
    
    == Instructions ==
    - [shift] to select selected text.
    - [ctrl] to generate output rule.
    - [alt] to copy generated rule to clipboard. ** this deselects what was selected **
    - may also click script button to copy to clipboard.
    */}

    // == script elements ==
    /*
<input name="inputRule" type="text"><br>
<input name="outputRule" type="text" disabled><br>
    */

    const startTime = performance.now();

    const rulePartsList = [
        [/hrefregex\.org/i, "/", "/,"],
        //[/\./i, "/", "/,"],
        //[/hrefregex\.org/i, "prefix", "suffix"],
    ];

    const inputWidth = 70; // default 70; defines the text box's width in pixels.
    // ==== AA. console messages ==================================================================|

    const enableLogMessages = 1; // default 1; set to 1 to show console messages.
    const enabledMessages = /RU|^1/; // default /RU|^1/
    function consolelog(text, messageType) {
        if (enableLogMessages && enabledMessages.test(messageType)) {
            console.log(text);
        }
    }
    consolelog("#### (RC) rule creator script began. ####", "SYS");

    // ==== AB. identifying prefix and suffix =====================================================|

    const hrefString = window.location.href;
    let ruleParts = [];
    for (let index = 0; index < rulePartsList.length; index++) {
        if (rulePartsList[index][0].test(hrefString)) {
            ruleParts[0] = rulePartsList[index][1];
            ruleParts[1] = rulePartsList[index][2];
            break;
        }
    }
    if (!ruleParts[0]) {
        ruleParts[0] = "/";
        ruleParts[1] = "/i,";
    }
    consolelog("## prefix & suffix: ("+ ruleParts[0] +" | "+ ruleParts[1] +") ##", "RU");

    // ==== BA. main functions ====================================================================|

    function getSelectionText(){
        var selectedText = ""
        if (window.getSelection){ // all modern browsers and IE9+
            selectedText = window.getSelection().toString()
        }
        return selectedText
    }

    jQuery(document).on("keydown", function (e) {
        //console.log("## keypress event ##");
        //console.log(e.charCode);
        if (e.shiftKey){
            // ==== copy text to input text =======================================================|
            let selectedText = getSelectionText();
            //console.log("input: "+ selectedText);
            jQuery("#input-rule").val(selectedText);
        }else if (e.ctrlKey){
            // ==== create rule from input text ===================================================|
            let inputText = jQuery("#input-rule").val();
            inputText = ruleParts[0]+ inputText +ruleParts[1];
            //console.log("output: "+ inputText);
            jQuery("#output-rule").val(inputText);
        }else if (e.altKey){
            outputClickEvent();
        }
    });

    function outputClickEvent(e) {
        //console.log("## output click event ##");
        //console.log(this);

        // ==== copy created rule from output text ================================================|
        const outputEle = document.querySelector('#output-rule');
        //console.log(outputEle);
        outputEle.focus();
        outputEle.select();
        document.execCommand('copy');
        const outputText = jQuery("#output-rule").val();
        consolelog("## copied: "+ outputText +" ##", "RU");
    }

    // ==== CA. script button =====================================================================|

    if (jQuery("#ctb-buttons").length) {
        const ruleCreatorCss =
        `<style type="text/css">
            #ctb-placeholder input {
                width: `+ inputWidth +`px;
                float: right;
            }    
        
            #cr-button {
                background: #ffb51b;
            }
            #output-rule{
                background: #ccc;
            }
        </style>`;
        jQuery(document.body).append(ruleCreatorCss); //bottom of the body

        jQuery("#ctb-buttons").append('<div id="cr-button">cp rl</div>');
        jQuery("#ctb-buttons").append('<input id="input-rule" type="text">');
        jQuery("#ctb-buttons").append('<input value="none" id="output-rule" type="text" readonly="readonly">');
        jQuery("#cr-button, #output-rule").click(outputClickEvent);
    }

    // ==== DA. script end ========================================================================|
    let endTime = performance.now();
    consolelog('#### (RC) loaded after ' + ((endTime - startTime)/1000).toFixed(2) + ' seconds. ####', "SYS");

    consolelog("#### (RC) rule creator script is active. ####", "SYS");
})();