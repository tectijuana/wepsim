/*
 *  Copyright 2015-2019 Felix Garcia Carballeira, Alejandro Calderon Mateos, Javier Prieto Cepeda, Saul Alonso Monsalve
 *
 *  This file is part of WepSIM.
 *
 *  WepSIM is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  WepSIM is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with WepSIM.  If not, see <http://www.gnu.org/licenses/>.
 *
 */


    /*
     * Config screen
     */

    function wepsim_open_config_index ( )
    {
	$('#container-config2').html(table_config_html(ws_config)) ;
        for (m=0; m<ws_config.length; m++) {
	     ws_config[m].code_init() ;
        }
	$("#container-config2").scrollTop(0);
        $('a[data-toggle="popover1"]').popover({
	          placement:  'bottom',
	          trigger:    'focus, hover',
	          animation:  false,
	          delay:      { "show": 500, "hide": 100 },
		  sanitizeFn: function (content) {
                                  return content ; // DOMPurify.sanitize(content) ;
                              }
        }) ;

	i18n_update_tags('cfg') ;
	$('#config2').modal('show') ;

	// stats about ui
        ga('send', 'event', 'ui', 'ui.dialog', 'ui.dialog.config');
    }

    function wepsim_close_config ( )
    {
        $('#config2').modal('hide') ;
    }


    /*
     * Config management
     */

    function table_config_html ( config )
    {
	var e_type        = "" ;
	var e_level       = "" ;
	var e_code_cfg    = "" ;
	var e_description = "" ;
	var e_id          = "" ;

        var fmt_toggle    = "" ;
        var fmt_header    = "" ;
        var fmt_level     = "" ;

        // first pass: build data
        var row = "" ;
        var config_groupby_type = {} ;
        for (var n=0; n<config.length; n++)
        {
		e_type        = config[n].type ;
		e_level       = config[n].level ;
		e_code_cfg    = config[n].code_cfg ;
		e_description = config[n].description ;
		e_id          = config[n].id ;

		// related row
	        if (fmt_toggle === "")
	            fmt_toggle = "bg-light" ;
	       else fmt_toggle = "" ;

	        if (e_level !== "actual")
	            fmt_level = "user_archived" ;
	       else fmt_level = "" ;

		  row = "<div class='row py-1 " + fmt_toggle + " " + fmt_level + "' id='" + e_type + "'>" +
			'<div class="col-md-auto">' +
			'    <span class="badge badge-pill badge-light">' + (n+1) + '</span>' +
			'</div>' +
			'<div class="col-md-4">'  + e_code_cfg   + '</div>' +
			'<div class="col-md collapse7 show"><c>' + e_description + '</c></div>' +
			'</div>' ;

		// indexing row
		if (typeof config_groupby_type[e_type] === "undefined") {
		    config_groupby_type[e_type] = [] ;
		}

		config_groupby_type[e_type].push({'row':   row, 
			                          'level': e_level}) ;
       }

       // second pass: build html
       var o = '<div class="container grid-striped border border-light">' ;
       var u = '' ;
       var l = '' ;
       for (var m in config_groupby_type)
       {
	        u = '' ;
	        l = config_groupby_type[m][0].level ;
                for (var n=0; n<config_groupby_type[m].length; n++)
                {
		     u = u + config_groupby_type[m][n].row ;

		     if (l !== config_groupby_type[m][n].level) {
			 l = '' ;
                     }
                }

		o = o + "<div class='float-none text-right text-capitalize font-weight-bold col-12 border-bottom border-secondary bg-white sticky-top user_" + l + "'>" + 
			"<span data-langkey='" + m + "'>" + m + "</span>" +
			"</div>" + u ;
       }
       o = o + '</div>' ;

       return o ;
    }

    function wepsim_show_breakpoint_icon_list ( )
    {
	var o = "<div class='container'>" +
	        "<div class='row'>" ;

	var prev_type = "" ;
	for (var i=0; i<breakpoint_icon_list.length; i++)
	{
		if (breakpoint_icon_list[i].type != prev_type) 
		{
                    o = o + "</div>" +
			    "<div class='row p-1'>" +
		            "<div class='float-none text-left text-capitalize font-weight-bold col-12 border-bottom border-secondary'>" + breakpoint_icon_list[i].type + "</div>" +
		            "</div>" +
		            "<div class='row'>" ;
		    prev_type = breakpoint_icon_list[i].type ;
		}

		o = o + "<img src='images/stop/stop_" + breakpoint_icon_list[i].shortname + ".gif' alt='" + breakpoint_icon_list[i].shortname + " icon' " +
		        "     class='img-thumbnail col-3 mx-2 d-block'" +
		        "     style='height:6vh; min-height:30px;'" +
		        "     onclick=\"$('#img_select1').attr('src','images/stop/stop_" + breakpoint_icon_list[i].shortname + ".gif');" +
		        "	        set_cfg('ICON_theme','" + breakpoint_icon_list[i].shortname + "'); save_cfg();" +
                        "               $('#breakpointicon1').popover('hide');\">" ;
	}
        o = o + '</div>' +
	        '<div class="row mt-2 p-1 border-top border-secondary">' +
                '<button type="button" id="close" data-role="none" ' +
                '        class="btn btn-sm btn-danger w-100 p-0" ' +
                '        onclick="$(\'#breakpointicon1\').popover(\'hide\');"><span data-langkey="Close">Close</span></button>' +
	        '</div>' +
	        '</div>';

	return o ;
    }

