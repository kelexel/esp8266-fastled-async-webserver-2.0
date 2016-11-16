/*
 * jQuery MiniColors: A tiny color picker built on jQuery
 *
 * Copyright Cory LaViska for A Beautiful Site, LLC. (http://www.abeautifulsite.net/)
 *
 * Licensed under the MIT license: http://opensource.org/licenses/MIT
 *
 */
if(jQuery)(function($){$.minicolors={defaults:{animationSpeed:50,animationEasing:'swing',change:null,changeDelay:0,control:'hue',dataUris:true,defaultValue:'',hide:null,hideSpeed:100,inline:false,letterCase:'lowercase',opacity:false,position:'bottom left',show:null,showSpeed:100,theme:'default'}};$.extend($.fn,{minicolors:function(method,data){switch(method){case'destroy':$(this).each(function(){destroy($(this))});return $(this);case'hide':hide();return $(this);case'opacity':if(data===undefined){return $(this).attr('data-opacity')}else{$(this).each(function(){updateFromInput($(this).attr('data-opacity',data))})}return $(this);case'rgbObject':return rgbObject($(this),method==='rgbaObject');case'rgbString':case'rgbaString':return rgbString($(this),method==='rgbaString');case'settings':if(data===undefined){return $(this).data('minicolors-settings')}else{$(this).each(function(){var settings=$(this).data('minicolors-settings')||{};destroy($(this));$(this).minicolors($.extend(true,settings,data))})}return $(this);case'show':show($(this).eq(0));return $(this);case'value':if(data===undefined){return $(this).val()}else{$(this).each(function(){updateFromInput($(this).val(data))})}return $(this);default:if(method!=='create')data=method;$(this).each(function(){init($(this),data)});return $(this)}}});function init(input,settings){var minicolors=$('<div class="minicolors" />'),defaults=$.minicolors.defaults;if(input.data('minicolors-initialized'))return;settings=$.extend(true,{},defaults,settings);minicolors.addClass('minicolors-theme-'+settings.theme).toggleClass('minicolors-with-opacity',settings.opacity).toggleClass('minicolors-no-data-uris',settings.dataUris!==true);if(settings.position!==undefined){$.each(settings.position.split(' '),function(){minicolors.addClass('minicolors-position-'+this)})}input.addClass('minicolors-input').data('minicolors-initialized',false).data('minicolors-settings',settings).prop('size',7).wrap(minicolors).after('<div class="minicolors-panel minicolors-slider-'+settings.control+'">'+'<div class="minicolors-slider minicolors-sprite">'+'<div class="minicolors-picker"></div>'+'</div>'+'<div class="minicolors-opacity-slider minicolors-sprite">'+'<div class="minicolors-picker"></div>'+'</div>'+'<div class="minicolors-grid minicolors-sprite">'+'<div class="minicolors-grid-inner"></div>'+'<div class="minicolors-picker"><div></div></div>'+'</div>'+'</div>');if(!settings.inline){input.after('<span class="minicolors-swatch minicolors-sprite"><span class="minicolors-swatch-color"></span></span>');input.next('.minicolors-swatch').on('click',function(event){event.preventDefault();input.focus()})}input.parent().find('.minicolors-panel').on('selectstart',function(){return false}).end();if(settings.inline)input.parent().addClass('minicolors-inline');updateFromInput(input,false);input.data('minicolors-initialized',true)}function destroy(input){var minicolors=input.parent();input.removeData('minicolors-initialized').removeData('minicolors-settings').removeProp('size').removeClass('minicolors-input');minicolors.before(input).remove()}function show(input){var minicolors=input.parent(),panel=minicolors.find('.minicolors-panel'),settings=input.data('minicolors-settings');if(!input.data('minicolors-initialized')||input.prop('disabled')||minicolors.hasClass('minicolors-inline')||minicolors.hasClass('minicolors-focus'))return;hide();minicolors.addClass('minicolors-focus');panel.stop(true,true).fadeIn(settings.showSpeed,function(){if(settings.show)settings.show.call(input.get(0))})}function hide(){$('.minicolors-focus').each(function(){var minicolors=$(this),input=minicolors.find('.minicolors-input'),panel=minicolors.find('.minicolors-panel'),settings=input.data('minicolors-settings');panel.fadeOut(settings.hideSpeed,function(){if(settings.hide)settings.hide.call(input.get(0));minicolors.removeClass('minicolors-focus')})})}function move(target,event,animate){var input=target.parents('.minicolors').find('.minicolors-input'),settings=input.data('minicolors-settings'),picker=target.find('[class$=-picker]'),offsetX=target.offset().left,offsetY=target.offset().top,x=Math.round(event.pageX-offsetX),y=Math.round(event.pageY-offsetY),duration=animate?settings.animationSpeed:0,wx,wy,r,phi;if(event.originalEvent.changedTouches){x=event.originalEvent.changedTouches[0].pageX-offsetX;y=event.originalEvent.changedTouches[0].pageY-offsetY}if(x<0)x=0;if(y<0)y=0;if(x>target.width())x=target.width();if(y>target.height())y=target.height();if(target.parent().is('.minicolors-slider-wheel')&&picker.parent().is('.minicolors-grid')){wx=75-x;wy=75-y;r=Math.sqrt(wx*wx+wy*wy);phi=Math.atan2(wy,wx);if(phi<0)phi+=Math.PI*2;if(r>75){r=75;x=75-(75*Math.cos(phi));y=75-(75*Math.sin(phi))}x=Math.round(x);y=Math.round(y)}if(target.is('.minicolors-grid')){picker.stop(true).animate({top:y+'px',left:x+'px'},duration,settings.animationEasing,function(){updateFromControl(input,target)})}else{picker.stop(true).animate({top:y+'px'},duration,settings.animationEasing,function(){updateFromControl(input,target)})}}function updateFromControl(input,target){function getCoords(picker,container){var left,top;if(!picker.length||!container)return null;left=picker.offset().left;top=picker.offset().top;return{x:left-container.offset().left+(picker.outerWidth()/2),y:top-container.offset().top+(picker.outerHeight()/2)}}var hue,saturation,brightness,x,y,r,phi,hex=input.val(),opacity=input.attr('data-opacity'),minicolors=input.parent(),settings=input.data('minicolors-settings'),swatch=minicolors.find('.minicolors-swatch'),grid=minicolors.find('.minicolors-grid'),slider=minicolors.find('.minicolors-slider'),opacitySlider=minicolors.find('.minicolors-opacity-slider'),gridPicker=grid.find('[class$=-picker]'),sliderPicker=slider.find('[class$=-picker]'),opacityPicker=opacitySlider.find('[class$=-picker]'),gridPos=getCoords(gridPicker,grid),sliderPos=getCoords(sliderPicker,slider),opacityPos=getCoords(opacityPicker,opacitySlider);if(target.is('.minicolors-grid, .minicolors-slider')){switch(settings.control){case'wheel':x=(grid.width()/2)-gridPos.x;y=(grid.height()/2)-gridPos.y;r=Math.sqrt(x*x+y*y);phi=Math.atan2(y,x);if(phi<0)phi+=Math.PI*2;if(r>75){r=75;gridPos.x=69-(75*Math.cos(phi));gridPos.y=69-(75*Math.sin(phi))}saturation=keepWithin(r/0.75,0,100);hue=keepWithin(phi*180/Math.PI,0,360);brightness=keepWithin(100-Math.floor(sliderPos.y*(100/slider.height())),0,100);hex=hsb2hex({h:hue,s:saturation,b:brightness});slider.css('backgroundColor',hsb2hex({h:hue,s:saturation,b:100}));break;case'saturation':hue=keepWithin(parseInt(gridPos.x*(360/grid.width()),10),0,360);saturation=keepWithin(100-Math.floor(sliderPos.y*(100/slider.height())),0,100);brightness=keepWithin(100-Math.floor(gridPos.y*(100/grid.height())),0,100);hex=hsb2hex({h:hue,s:saturation,b:brightness});slider.css('backgroundColor',hsb2hex({h:hue,s:100,b:brightness}));minicolors.find('.minicolors-grid-inner').css('opacity',saturation/100);break;case'brightness':hue=keepWithin(parseInt(gridPos.x*(360/grid.width()),10),0,360);saturation=keepWithin(100-Math.floor(gridPos.y*(100/grid.height())),0,100);brightness=keepWithin(100-Math.floor(sliderPos.y*(100/slider.height())),0,100);hex=hsb2hex({h:hue,s:saturation,b:brightness});slider.css('backgroundColor',hsb2hex({h:hue,s:saturation,b:100}));minicolors.find('.minicolors-grid-inner').css('opacity',1-(brightness/100));break;default:hue=keepWithin(360-parseInt(sliderPos.y*(360/slider.height()),10),0,360);saturation=keepWithin(Math.floor(gridPos.x*(100/grid.width())),0,100);brightness=keepWithin(100-Math.floor(gridPos.y*(100/grid.height())),0,100);hex=hsb2hex({h:hue,s:saturation,b:brightness});grid.css('backgroundColor',hsb2hex({h:hue,s:100,b:100}));break}input.val(convertCase(hex,settings.letterCase))}if(target.is('.minicolors-opacity-slider')){if(settings.opacity){opacity=parseFloat(1-(opacityPos.y/opacitySlider.height())).toFixed(2)}else{opacity=1}if(settings.opacity)input.attr('data-opacity',opacity)}swatch.find('SPAN').css({backgroundColor:hex,opacity:opacity});doChange(input,hex,opacity)}function updateFromInput(input,preserveInputValue){var hex,hsb,opacity,x,y,r,phi,minicolors=input.parent(),settings=input.data('minicolors-settings'),swatch=minicolors.find('.minicolors-swatch'),grid=minicolors.find('.minicolors-grid'),slider=minicolors.find('.minicolors-slider'),opacitySlider=minicolors.find('.minicolors-opacity-slider'),gridPicker=grid.find('[class$=-picker]'),sliderPicker=slider.find('[class$=-picker]'),opacityPicker=opacitySlider.find('[class$=-picker]');hex=convertCase(parseHex(input.val(),true),settings.letterCase);if(!hex){hex=convertCase(parseHex(settings.defaultValue,true),settings.letterCase)}hsb=hex2hsb(hex);if(!preserveInputValue)input.val(hex);if(settings.opacity){opacity=input.attr('data-opacity')===''?1:keepWithin(parseFloat(input.attr('data-opacity')).toFixed(2),0,1);if(isNaN(opacity))opacity=1;input.attr('data-opacity',opacity);swatch.find('SPAN').css('opacity',opacity);y=keepWithin(opacitySlider.height()-(opacitySlider.height()*opacity),0,opacitySlider.height());opacityPicker.css('top',y+'px')}swatch.find('SPAN').css('backgroundColor',hex);switch(settings.control){case'wheel':r=keepWithin(Math.ceil(hsb.s*0.75),0,grid.height()/2);phi=hsb.h*Math.PI/180;x=keepWithin(75-Math.cos(phi)*r,0,grid.width());y=keepWithin(75-Math.sin(phi)*r,0,grid.height());gridPicker.css({top:y+'px',left:x+'px'});y=150-(hsb.b/(100/grid.height()));if(hex==='')y=0;sliderPicker.css('top',y+'px');slider.css('backgroundColor',hsb2hex({h:hsb.h,s:hsb.s,b:100}));break;case'saturation':x=keepWithin((5*hsb.h)/12,0,150);y=keepWithin(grid.height()-Math.ceil(hsb.b/(100/grid.height())),0,grid.height());gridPicker.css({top:y+'px',left:x+'px'});y=keepWithin(slider.height()-(hsb.s*(slider.height()/100)),0,slider.height());sliderPicker.css('top',y+'px');slider.css('backgroundColor',hsb2hex({h:hsb.h,s:100,b:hsb.b}));minicolors.find('.minicolors-grid-inner').css('opacity',hsb.s/100);break;case'brightness':x=keepWithin((5*hsb.h)/12,0,150);y=keepWithin(grid.height()-Math.ceil(hsb.s/(100/grid.height())),0,grid.height());gridPicker.css({top:y+'px',left:x+'px'});y=keepWithin(slider.height()-(hsb.b*(slider.height()/100)),0,slider.height());sliderPicker.css('top',y+'px');slider.css('backgroundColor',hsb2hex({h:hsb.h,s:hsb.s,b:100}));minicolors.find('.minicolors-grid-inner').css('opacity',1-(hsb.b/100));break;default:x=keepWithin(Math.ceil(hsb.s/(100/grid.width())),0,grid.width());y=keepWithin(grid.height()-Math.ceil(hsb.b/(100/grid.height())),0,grid.height());gridPicker.css({top:y+'px',left:x+'px'});y=keepWithin(slider.height()-(hsb.h/(360/slider.height())),0,slider.height());sliderPicker.css('top',y+'px');grid.css('backgroundColor',hsb2hex({h:hsb.h,s:100,b:100}));break}if(input.data('minicolors-initialized')){doChange(input,hex,opacity)}}function doChange(input,hex,opacity){var settings=input.data('minicolors-settings'),lastChange=input.data('minicolors-lastChange');if(!lastChange||lastChange.hex!==hex||lastChange.opacity!==opacity){input.data('minicolors-lastChange',{hex:hex,opacity:opacity});if(settings.change){if(settings.changeDelay){clearTimeout(input.data('minicolors-changeTimeout'));input.data('minicolors-changeTimeout',setTimeout(function(){settings.change.call(input.get(0),hex,opacity)},settings.changeDelay))}else{settings.change.call(input.get(0),hex,opacity)}}input.trigger('change').trigger('input')}}function rgbObject(input){var hex=parseHex($(input).val(),true),rgb=hex2rgb(hex),opacity=$(input).attr('data-opacity');if(!rgb)return null;if(opacity!==undefined)$.extend(rgb,{a:parseFloat(opacity)});return rgb}function rgbString(input,alpha){var hex=parseHex($(input).val(),true),rgb=hex2rgb(hex),opacity=$(input).attr('data-opacity');if(!rgb)return null;if(opacity===undefined)opacity=1;if(alpha){return'rgba('+rgb.r+', '+rgb.g+', '+rgb.b+', '+parseFloat(opacity)+')'}else{return'rgb('+rgb.r+', '+rgb.g+', '+rgb.b+')'}}function convertCase(string,letterCase){return letterCase==='uppercase'?string.toUpperCase():string.toLowerCase()}function parseHex(string,expand){string=string.replace(/[^A-F0-9]/ig,'');if(string.length!==3&&string.length!==6)return'';if(string.length===3&&expand){string=string[0]+string[0]+string[1]+string[1]+string[2]+string[2]}return'#'+string}function keepWithin(value,min,max){if(value<min)value=min;if(value>max)value=max;return value}function hsb2rgb(hsb){var rgb={};var h=Math.round(hsb.h);var s=Math.round(hsb.s*255/100);var v=Math.round(hsb.b*255/100);if(s===0){rgb.r=rgb.g=rgb.b=v}else{var t1=v;var t2=(255-s)*v/255;var t3=(t1-t2)*(h%60)/60;if(h===360)h=0;if(h<60){rgb.r=t1;rgb.b=t2;rgb.g=t2+t3}else if(h<120){rgb.g=t1;rgb.b=t2;rgb.r=t1-t3}else if(h<180){rgb.g=t1;rgb.r=t2;rgb.b=t2+t3}else if(h<240){rgb.b=t1;rgb.r=t2;rgb.g=t1-t3}else if(h<300){rgb.b=t1;rgb.g=t2;rgb.r=t2+t3}else if(h<360){rgb.r=t1;rgb.g=t2;rgb.b=t1-t3}else{rgb.r=0;rgb.g=0;rgb.b=0}}return{r:Math.round(rgb.r),g:Math.round(rgb.g),b:Math.round(rgb.b)}}function rgb2hex(rgb){var hex=[rgb.r.toString(16),rgb.g.toString(16),rgb.b.toString(16)];$.each(hex,function(nr,val){if(val.length===1)hex[nr]='0'+val});return'#'+hex.join('')}function hsb2hex(hsb){return rgb2hex(hsb2rgb(hsb))}function hex2hsb(hex){var hsb=rgb2hsb(hex2rgb(hex));if(hsb.s===0)hsb.h=360;return hsb}function rgb2hsb(rgb){var hsb={h:0,s:0,b:0};var min=Math.min(rgb.r,rgb.g,rgb.b);var max=Math.max(rgb.r,rgb.g,rgb.b);var delta=max-min;hsb.b=max;hsb.s=max!==0?255*delta/max:0;if(hsb.s!==0){if(rgb.r===max){hsb.h=(rgb.g-rgb.b)/delta}else if(rgb.g===max){hsb.h=2+(rgb.b-rgb.r)/delta}else{hsb.h=4+(rgb.r-rgb.g)/delta}}else{hsb.h=-1}hsb.h*=60;if(hsb.h<0){hsb.h+=360}hsb.s*=100/255;hsb.b*=100/255;return hsb}function hex2rgb(hex){hex=parseInt(((hex.indexOf('#')>-1)?hex.substring(1):hex),16);return{r:hex>>16,g:(hex&0x00FF00)>>8,b:(hex&0x0000FF)}}$(document).on('mousedown.minicolors touchstart.minicolors',function(event){if(!$(event.target).parents().add(event.target).hasClass('minicolors')){hide()}}).on('mousedown.minicolors touchstart.minicolors','.minicolors-grid, .minicolors-slider, .minicolors-opacity-slider',function(event){var target=$(this);event.preventDefault();$(document).data('minicolors-target',target);move(target,event,true)}).on('mousemove.minicolors touchmove.minicolors',function(event){var target=$(document).data('minicolors-target');if(target)move(target,event)}).on('mouseup.minicolors touchend.minicolors',function(){$(this).removeData('minicolors-target')}).on('mousedown.minicolors touchstart.minicolors','.minicolors-swatch',function(event){var input=$(this).parent().find('.minicolors-input');event.preventDefault();show(input)}).on('focus.minicolors','.minicolors-input',function(){var input=$(this);if(!input.data('minicolors-initialized'))return;show(input)}).on('blur.minicolors','.minicolors-input',function(){var input=$(this),settings=input.data('minicolors-settings');if(!input.data('minicolors-initialized'))return;input.val(parseHex(input.val(),true));if(input.val()==='')input.val(parseHex(settings.defaultValue,true));input.val(convertCase(input.val(),settings.letterCase))}).on('keydown.minicolors','.minicolors-input',function(event){var input=$(this);if(!input.data('minicolors-initialized'))return;switch(event.keyCode){case 9:hide();break;case 13:case 27:hide();input.blur();break}}).on('keyup.minicolors','.minicolors-input',function(){var input=$(this);if(!input.data('minicolors-initialized'))return;updateFromInput(input,true)}).on('paste.minicolors','.minicolors-input',function(){var input=$(this);if(!input.data('minicolors-initialized'))return;setTimeout(function(){updateFromInput(input,true)},1)})})(jQuery);
