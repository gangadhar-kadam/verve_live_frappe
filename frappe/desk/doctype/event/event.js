// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// MIT License. See license.txt

/*frappe.ui.form.on("Event", "refresh", function(frm,dt,dn) {
  var date = frappe.datetime.now_datetime()
  // console.log(date)
  // console.log(frm.doc.starts_on)
  // console.log(frm.doc.starts_on < '2015-09-04 10:31:00')
	if(frm.doc.ref_type && frm.doc.ref_name) {
		frm.add_custom_button(__(frm.doc.ref_name), function() {
			frappe.set_route("Form", frm.doc.ref_type, frm.doc.ref_name);
		}, frappe.boot.doctype_icons[frm.doc.ref_type]);
	}
  //if(!frm.doc.__islocal ) {
  //    frm.add_custom_button(__("Create Attendance"), cur_frm.cscript.create_event_attendance,frappe.boot.doctype_icons["Customer"], "btn-default");
  ///}
  
  /*get_server_fields('set_higher_values','','',frm.doc, dt, dn, 1, function(r){
      refresh_field('region');
      refresh_field('zone');
      refresh_field('church_group');
      refresh_field('church');
      refresh_field('pcf');
      refresh_field('senior_cell');
    });*/

//});

/*frappe.ui.form.on("Event", "validate", function(frm,doc) {
  var date = frappe.datetime.now_datetime()
   if(frm.doc.starts_on){
    // var date = frappe.datetime.now_datetime()
    // console.log(28-08-2015 08:00:00 < 2015-09-04 10:31:00)
    if(frm.doc.starts_on < date){
      msgprint("Start Date should be todays or greater than todays date.");
      throw "Check Start Date";
    }
  }
  if(frm.doc.starts_on && frm.doc.ends_on){
    if(frm.doc.starts_on >= frm.doc.ends_on){
      msgprint("End Date should be greater than start date.");
      throw "Check End Date";
    }
  }
});

frappe.ui.form.on("Event", "repeat_on", function(frm,doc) {
	if(frm.doc.repeat_on==="Every Day") {
		$.each(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"], function(i,v) {
			cur_frm.set_value(v, 1);
		})
	}
});*/

// frappe.ui.form.on("Event", "starts_on", function(frm,doc) {
//   if(frm.doc.starts_on) {
//     var date= frappe.datetime.now_datetime()
//     // console.log(date)
//     if(frm.doc.starts_on < date){
//       msgprint("Start Date should be todays or greater than todays date.");
//       // throw "Check Start Date";
//     }
//   }
// });
// frappe.ui.form.on("Event", "ends_on", function(frm,doc) {
//   if(frm.doc.starts_on) {
//     if(frm.doc.starts_on > frm.doc.ends_on){
//       msgprint("End Date should be greater than start date.");
//       // throw "Check  Date";
//     }
//   }
// });

/*frappe.ui.form.on("Event", "onload", function(frm,doc) {
		$( "#map-canvas" ).remove();
		$(cur_frm.get_field("address").wrapper).append('<div id="map-canvas" style="width: 425px; height: 425px;"></div>');
		if(!frm.doc.__islocal ) {
			cur_frm.cscript.create_pin_on_map(frm.doc,frm.doc.lat,frm.doc.lon);
			//frm.add_custom_button(__("Create Attendance"), cur_frm.cscript.create_event_attendance,frappe.boot.doctype_icons["Customer"], "btn-default");
		}
});

cur_frm.cscript.create_event_attendance = function() {
		frappe.model.open_mapped_doc({
			method: "church_ministry.church_ministry.doctype.event_attendance.event_attendance.create_event_attendance",
			frm: cur_frm
		})
}

cur_frm.cscript.create_pin_on_map=function(doc,lat,lon){
        var latLng = new google.maps.LatLng(lat, lon);
        var map = new google.maps.Map(document.getElementById('map-canvas'), {
            zoom: 16,
            center: latLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });
        var marker = new google.maps.Marker({
            position: latLng,
            title: 'Point',
            map: map,
            draggable: true
          });

        updateMarkerPosition(latLng);
        geocodePosition(latLng);

        google.maps.event.addListener(marker, 'dragstart', function() {
            updateMarkerAddress('Dragging...');
        });

        google.maps.event.addListener(marker, 'drag', function() {
            updateMarkerStatus('Dragging...');
            updateMarkerPosition(marker.getPosition());
        });

        google.maps.event.addListener(marker, 'dragend', function() {
            updateMarkerStatus('Drag ended');
            geocodePosition(marker.getPosition());
          });
}

function geocodePosition(pos) {
      geocoder.geocode({
        latLng: pos
      }, function(responses) {
        if (responses && responses.length > 0) {
          updateMarkerAddress(responses[0].formatted_address);
        } else {
          if(doc.__islocal) {
            alert('Cannot determine address at this location.');
          }
        }
      });
      geocoder.geocode( { 'address': doc.address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        doc.lat=results[0].geometry.location.lat();
        doc.lon=results[0].geometry.location.lng();
        refresh_field('lat')
        refresh_field('lon')
      } 
    });
}

function updateMarkerAddress(str) {
  doc=cur_frm.doc
  doc.address= str;
  refresh_field('address');
}

function updateMarkerStatus(str) {
var s=1;
}

function updateMarkerPosition(latLng) {
  doc=cur_frm.doc
  doc.lat=latLng.lat()
  doc.lon=latLng.lng()
  refresh_field('lat')
  refresh_field('lon')
}

var geocoder = new google.maps.Geocoder();
var getMarkerUniqueId= function(lat, lng) {
    return lat + '_' + lng;
}

var getLatLng = function(lat, lng) {
    return new google.maps.LatLng(lat, lng);
};

cur_frm.cscript.address = function(doc, dt, dn){
      geocoder.geocode( { 'address': doc.address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
          doc.address=results[0].formatted_address;
          refresh_field('address');
          var latLng = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());

          var map = new google.maps.Map(document.getElementById('map-canvas'), {
              zoom: 16,
              center: latLng,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            });

          var marker = new google.maps.Marker({
              position: latLng,
              title: 'Point',
              map: map,
              draggable: true
            });
          updateMarkerPosition(latLng);
          geocodePosition(latLng);

          google.maps.event.addListener(marker, 'dragend', function() {
              geocodePosition(marker.getPosition());
          });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
}
*/