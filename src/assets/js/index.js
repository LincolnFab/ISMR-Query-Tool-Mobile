var url = "https://is-cigala-calibra.fct.unesp.br/is/ismrtool/calc-var/service_loadISMR.php"
var url2 = "https://ismrquerytool.fct.unesp.br/is/ismrtool/calc-var/service_loadStationList.php?"
var group1 = "https://ismrquerytool.fct.unesp.br/is/stations/getStationCoord.php?group=1";
var group2 = "https://ismrquerytool.fct.unesp.br/is/stations/getStationCoord.php?group=2";

// https://is-cigala-calibra.fct.unesp.br/is/ismrtool/calc-var/service_loadISMR.php?date_begin=2014-10-01 22:00:00&date_end=2014-10-01 22:05:00&station=5&mode=json&key=cb9fe2c0ec0c4b85032000937a8198d8

function presentAlertError() {
    const alert = document.createElement('ion-alert');
    alert.cssClass = 'my-custom-class';
    // alert.header = '';
    alert.subHeader = 'Não existe dados para essa requisição';
    alert.message = 'Verifique os filtros e tente novamente';
    alert.buttons = ['OK'];

    document.body.appendChild(alert);
    return alert.present();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getColor(svid) {
    // color brewer colors
    // var colorsb = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99'];

    // ismr query tool colors
    var colors = new Array('87CEEB', '00FF00', 'FFA500', '0000FF',
        'FF0000', '006400', '800080', 'CD853F',
        '00FFFF', 'FA8072', '6A5ACD', '9ACD32',
        'FF00FF', '7FFFD4', 'FFD700', 'EE82EE');

    var ret = colors[parseInt(svid) % colors.length]; // repete cores

    return ret;
}

function getMarkerSymbol(svid, sameColorSize) {
    // Ex: given sameColorSize=16, then svid from 1 to 16 will be diamond
    var markers = ['diamond', 'circle', 'square', 'cross', 'x', 'triangle-up', 'triangle-down', 'pentagon'];
    var posic = parseInt(parseInt(svid) / sameColorSize);
    var ret = markers[posic];

    return ret;
}

function getBeautyName(name) {
    if (name == "s4")
        return "S<sub>4</sub> (L1)"
    else if (name == "s4_l2")
        return "S<sub>4</sub> (L2)"
    else if (name == "s4_l5")
        return "S<sub>4</sub> (L5)"
    else if (name == "phi60l1")
        return "Sigma - Fi (L1)"
    else if (name == "phi60_l5")
        return "Sigma - Fi (L5)"
}

function getSatelliteName(satelite) {
    if (satelite > 0 && satelite < 38)
        return 'G' + satelite
    else if (satelite > 37 && satelite < 62)
        return 'R' + (satelite - 37)
    else if (satelite > 70 && satelite < 103)
        return 'E' + (satelite - 70)
    else if (satelite > 119 && satelite < 141)
        return 'S' + satelite
    else if (satelite > 140 && satelite < 173)
        return 'C' + (satelite - 140)
    else if (satelite > 180 && satelite < 188)
        return 'J' + (satelite - 180)
}

async function plot() {
    // console.time()
    $("#progressbar").show(0);

    // tempo
    var date_begin = $("#date").val();
    var date_end = $("#date_end").val();
    var time_begin = $("#time_begin").val();
    var time_end = $("#time_end").val();

    var date_begin = date_begin + " " + time_begin;
    var date_end = date_end + " " + time_end;

    // dados
    var stationName = $("#stationName").val();
    var dataType = $("#dataType").val();
    dataType = dataType + ",time_utc,elev,svid";
    var elev = $("#elev").val();
    var satelite = $(".glonass, .gps, .galileo, .sbas, .beidou, .qzss").map(
        function () {
            return this.value;
        });

    // estilo
    var lineStyle = $("#lineStyle").val();
    var lineWidth = $("#lineWidth").val();

    // eixos tempo x tipo de dado
    var yAxis = [];
    var time = [];

    // variavel dos dados organizados para o plot
    var chart = [];

    // tipo de marcadores do gráfico
    var type;

    /*
            date_begin: date_begin,
            date_end: date_end,
            stationName: stationName,
            field_list: dataType,
            mode: "json",
            key: "cb9fe2c0ec0c4b85032000937a8198d8"

            date_begin: "2020-12-13 12:00:00",
            date_end: "2020-12-13 18:00:00",
            stationName: "PRU4",
            field_list: dataType,
            mode: "json",
            key: "cb9fe2c0ec0c4b85032000937a8198d8"
    */

    $.ajax({
        method: "POST",
        url: url,
        dataType: 'json',
        data: {
            date_begin: date_begin,
            date_end: date_end,
            stationName: stationName,
            field_list: dataType,
            mode: "json",
            key: "cb9fe2c0ec0c4b85032000937a8198d8"
        }
    }).done(function (data) {
        dataType = dataType.replace(",time_utc,elev,svid", "");

        if (satelite.length == 0 || lineWidth <= 0 && lineWidth > 10 || elev < 1 || elev > 45) {
            presentAlertError();
            // console.timeEnd();
            $("#progressbar").hide(0);
            return true;
        }

        // layout do gráfico
        var layout = {
            title: 'Station ' + stationName + ' ' + date_begin,
            hovermode: 'closest',
            xaxis: {
                title: {
                    text: 'Time (UT)<br><sub>ISMR Query Tool - INCT GNSS NavAer</sub>',
                },
                fixedrange: true
            },
            yaxis: {
                range: [0, 1],
                title: {
                    text: getBeautyName(dataType),
                },
                fixedrange: true
            },
            dragmode: false
        };

        // configuração do gráfico
        var config = {
            displayModeBar: false,
            responsive: true,
            scrollZoom: false
        }

        // plot
        for (j = 0; j < satelite.length; j++) {

            for (i = 0; i < data.length; i++) {
                if (data[i].svid == satelite[j]) {
                    if (data[i][dataType] != 'NaN' && data[i].elev >= elev)
                        yAxis.push(data[i][dataType]);

                    time.push(data[i].time_utc);
                }
            }


            if (lineStyle == 'none')
                type = 'markers';
            else
                type = 'lines+markers';

            if (yAxis != "" && time != "") {
                var trace = {
                    x: time,
                    y: yAxis,
                    name: getSatelliteName(satelite[j]),
                    mode: type,
                    showlegend: true,
                    zeroline: false,
                    line: {
                        dash: lineStyle,
                        width: lineWidth
                    },
                    marker: {
                        color: getColor(chart.length),
                        symbol: getMarkerSymbol(chart.length, 16)
                    }
                }
                chart.push(trace);
                yAxis = []
                time = []
            }
        }

        if (chart != "")
            Plotly.newPlot('chart1', chart, layout, config).then(
                function (gd) {
                    return Plotly.toImage(gd, { height: 720, width: 1280 })
                        .then(
                            function (url) {
                                $("#image").html(url);
                            }
                        )
                });
        else {
            presentAlertError();
            $("#progressbar").hide(0);
            return true;
        }

        $("#progressbar").hide(0);
        // console.timeEnd();
        return false;

    }).fail(function (error) {
        presentAlertError();

        // console.timeEnd();
        // console.log(error);
        $("#progressbar").hide(0);
    });

    await sleep(1500);

    $("#butao").click();
}

// New Skyplot

function verify() {
    $("#map_container_sky").remove();

    var option = $("#option_sky").val();

    var date = $("#date_sky").val();
    var time_begin_str = $("#time_begin_sky").val()
    var time_end_str = $("#time_end_sky").val()
    var date_begin_str = date + " " + time_begin_str;
    var date_end_str = date + " " + time_end_str;

    // var date = "2020-12-13";
    // var date_begin_str = date + " 12:00:00";
    // var date_end_str = date + " 13:00:00";


    var stationName = $("#stationName_sky").val();
    // console.log("Opção........: " + option);
    // console.log("Data Inicial.: " + date_begin_str);
    // console.log("Data Final...: " + date_end_str);
    // console.log("Estação......: " + stationName);

    if (stationName == "" || date == "" || date_begin_str == "" || date_end_str == "" || time_begin_str == "" || time_end_str == "") {
        presentAlertError()
        return 1;
    }
    else {
        $("#progressbarSky").show(0);
        if (option == "map") {
            mapa(date_begin_str);
        }
        else {
            request(stationName, date_begin_str, date_end_str);
        }
    }
}

function dateAdd(date, interval, units) {
    if (!(date instanceof Date))
        return undefined;
    var ret = new Date(date);
    var checkRollover = function () { if (ret.getDate() != date.getDate()) ret.setDate(0); };
    switch (String(interval).toLowerCase()) {
        case 'year': ret.setFullYear(ret.getFullYear() + units); checkRollover(); break;
        case 'quarter': ret.setMonth(ret.getMonth() + 3 * units); checkRollover(); break;
        case 'month': ret.setMonth(ret.getMonth() + units); checkRollover(); break;
        case 'week': ret.setDate(ret.getDate() + 7 * units); break;
        case 'day': ret.setDate(ret.getDate() + units); break;
        case 'hour': ret.setTime(ret.getTime() + units * 3600000); break;
        case 'minute': ret.setTime(ret.getTime() + units * 60000); break;
        case 'second': ret.setTime(ret.getTime() + units * 1000); break;
        default: ret = undefined; break;
    }
    return ret;
}

function slice(x) {
    return ("0" + (x)).slice(-2);
}

function dateToString(date) {

    var date = date.getFullYear() + "-" + slice(date.getMonth() + 1) + "-" + slice(date.getDate()) + " " +
        slice(date.getHours()) + ":" + slice(date.getMinutes()) + ":" + slice(date.getSeconds());

    return date;
}

function unique(array) {
    var uniqueArr = [...new Set(array)];
    return uniqueArr;
}

function compareNumbers(a, b) {
    return a - b;
}

function subsetWhere(rows, key, value) {
    var d = [];

    for (let i = 0; i < rows.length; i++) {
        if (rows[i][key] === value) {
            d.push(rows[i]);
        }
    }
    return d;
}

function unpack(rows, key) {
    return rows.map(function (row) {
        return row[key];
    });
}

function markerLayerClick(e) {
    $("#progressbarSky").show(0);
    // console.log(e.target.stationName)
    // console.log(e.target.date_b)
    // console.log(e.target.date_e)
    request(e.target.stationName, e.target.date_b, e.target.date_e);
}

function tempoDecorrido(funcao) {
    var args = Array.prototype.slice.call(arguments, 1);

    var inicio = performance.now();

    funcao.apply(null, args);

    return performance.now() - inicio;
}

function request(stationName, date_begin_str, date_end_str) {
    // console.time();

    var urlData = url + "?date_begin=" + date_begin_str + "&date_end=" + date_end_str + "&stationName=" + stationName + "&field_list=svid,elev,azim,s4,time_utc&mode=csv&key=cb9fe2c0ec0c4b85032000937a8198d8";

    // console.log(urlData)

    Plotly.d3.csv(urlData, function (err, rows) {
        // console.log(rows);
        skyPlot(rows, stationName, date_begin_str);

    });
}

async function skyPlot(rows, stationName, date) {
    date = date.substr(0, 10);
    $("#gps_sky_container").html("");

    var svids = (unpack(rows, 'svid'));
    var uniqueSvids = unique(svids).map(Number).sort(compareNumbers);
    var dataSky = [];
    var dataPlot = [];
    var showScale = true;

    var configSky = {
        displayModeBar: false,
        responsive: true,
        staticPlot: true
    }

    var configPlot = {
        displayModeBar: false,
        responsive: true,
        scrollZoom: false
    }

    if (svids.length == 0 && uniqueSvids.length == 0) {
        $("#progressbarSky").hide(0);
        presentAlertError();
        return 1;
    }

    // console.log(uniqueSvids.length);
    // console.log(uniqueSvids);

    for (let i = 0; i < uniqueSvids.length; i++) {
        let svidPlot = uniqueSvids[i].toString();
        var s2 = subsetWhere(rows, 'svid', svidPlot);

        var elevData = unpack(s2, 'elev');
        var azimData = unpack(s2, 'azim');
        var s4Data = unpack(s2, 's4');
        var timeData = unpack(s2, 'time_utc');
        var posic = parseInt(elevData.length - 1)

        var tracePlot = {
            x: timeData,
            y: s4Data,
            name: "G" + svidPlot,
            mode: 'markers',
            showlegend: true,
            zeroline: false,
            line: {
                dash: 'none'
            },
            marker: {
                color: getColor(dataPlot.length),
                symbol: getMarkerSymbol(dataPlot.length, 16)
            }
        }

        var s4TimeData = [];
        for (let j = 0; j < s4Data.length; j++) {
            s4TimeData.push(s4Data[j] + "<br><sub>" + timeData[j] + "(UT)</sub>");
        }

        var trace1Sky = {
            type: "scatterpolar",
            name: "G" + svidPlot,
            mode: "markers",
            r: elevData,
            theta: azimData,
            meta: s4TimeData,
            textposition: "bottom right",
            hovertemplate: "Azim: %{theta}<br>Elev: %{r} <br>S<sub>4</sub>: %{meta}",
            marker: {
                color: s4Data,
                colorscale: 'Jet',
                showscale: showScale,
                cmin: 0,
                cmax: 1,
                size: 10,
                symbol: 'circle'
            }
        };

        var trace2Sky = {
            type: "scatterpolar",
            name: "G" + svidPlot, // name for hover and legend (if used)
            mode: "text", // "markers+text"
            r: [elevData[posic]], // elevation
            theta: [azimData[posic]], // azimuth
            text: "<span style='color: #" + getColor(dataPlot.length) + ";'><b>  G" + svidPlot + "</b></span>", // text for marker+text (if used)
            meta: { s4: [s4Data[posic]] },
            textposition: "bottom right",
            hovertext: "", // disable hover
            hoverinfo: "none"
        };

        if (showScale === true) {
            showScale = false;
        }

        if (parseInt(svidPlot) < 32) {
            dataSky.push(trace1Sky);
            dataSky.push(trace2Sky);
            dataPlot.push(tracePlot);
        }
    }

    var layoutPlot = {
        title: 'Station ' + stationName + ' ' + date,
        hovermode: 'closest',
        xaxis: {
            title: {
                text: 'Time (UT)<br><sub>ISMR Query Tool - INCT GNSS NavAer</sub>',
            },
            fixedrange: true
        },
        yaxis: {
            range: [0, 1],
            title: {
                text: "S<sub>4</sub>",
            },
            fixedrange: true
        },
        dragmode: false
    };

    var layoutSky = {
        title: "Station " + stationName + " " + date + " - S<sub>4</sub> Skyplot",
        polar: {
            angularaxis: {
                rotation: 90,
                direction: "clockwise"
            },
            radialaxis: {
                visible: true,
                rangemode: 'normal',
                angle: 90,
                range: [90, 0],
                tickmode: 'array',
                tickvals: [0, 15, 30, 45, 60, 75, 90],
                ticksuffix: "°",
                tickangle: 90
            }
        },
        showlegend: false,
    };



    if (dataSky != "") {
        Plotly.newPlot('gps_sky_container', dataSky, layoutSky, configSky).then(
            function (gd) {
                return Plotly.toImage(gd, { height: 640, width: 640 })
                    .then(
                        function (url) {
                            $("#image_sky").html(url);
                        }
                    )
            });

        Plotly.newPlot('gps_plot_container', dataPlot, layoutPlot, configPlot).then(
            function (gd) {
                return Plotly.toImage(gd, { height: 720, width: 1280 })
                    .then(
                        function (url) {
                            $("#image_plot").html(url);
                        }
                    )
            });
    } else {
        presentAlertError();
        $("#progressbarSky").hide(0);
        return true;
    }

    $("#progressbarSky").hide(0);

    // console.timeEnd()
    await sleep(1500);
    $("#butao_sky").click();
}

function mapa(date) {
    $("#progressbarSky").show(0);

    $("#map_container").remove();

    $("#map").html('<div id="map_container" style="width: auto; height: 300px; border-radius: 5px""></div>');

    var offset = $("#offset_time").val();

    date = new Date(date);

    if (offset != "") {
        var date_begin = dateAdd(date, 'minute', -offset);
        var date_end = dateAdd(date, 'minute', offset);
        var date_begin_str = dateToString(date_begin);
        var date_end_str = dateToString(date_end);
    }
    else {
        var date_begin = dateAdd(date, 'minute', -30);
        var date_end = dateAdd(date, 'minute', 30);
        var date_begin_str = dateToString(date_begin);
        var date_end_str = dateToString(date_end);
    }

    /*
    date_begin_str = "2014-10-01 10:00:00"
    date_end_str = "2014-10-01 11:00:00"
    date_begin: date_begin_str,
    date_end: date_end_str,
    date_begin: "2014-10-01 22:00:00",
    date_end: "2014-10-01 23:00:00",
    */

    $.ajax({
        async: true,
        url: url2,
        dataType: 'json',
        data: {
            date_begin: date_begin_str,
            date_end: date_end_str,
            mode: "json",
            key: "cb9fe2c0ec0c4b85032000937a8198d8"
        }
    }).done(function (data) {
        // popup
        function makePopupText(st) {
            var str = "Station: " + st.name + "<br/>" +
                "Latitude: " + st.lat_.substr(0, 7) + "<br/>" +
                "Longitude: " + st.long_.substr(0, 7) + "<br/>";
            return (str);
        }

        // Layer
        var layer = L.layerGroup();

        // Icones
        var icons = L.icon({
            iconUrl: '../../assets/marker/active.png',
            iconSize: [16, 28],
            iconAnchor: [5, 28],
            popupAnchor: [2, -27]
        });

        // Mapa
        var map = L.map('map_container').setView([-14, -50], 3);

        L.control.scale().addTo(map);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        for (var i = 0; i < data.length; i++) {
            if (data[i].lat_ !== null && data[i].long_ !== null) {
                var oneMarker = L.marker([data[i].lat_, data[i].long_], { icon: icons })
                    .bindPopup(makePopupText(data[i]))
                    .on("click", markerLayerClick);

                oneMarker.date_b = date_begin_str;
                oneMarker.date_e = date_end_str;
                oneMarker.stationName = data[i].name;

                oneMarker.addTo(layer);
            }
        }
        map.addLayer(layer);
    }).fail(function (error) {
        presentAlertError();
    });

    $("#progressbarSky").hide(0);
}



// Estação mais próxima

function getDistance(client, station) {

    var deg2rad = function (deg) { return deg * (Math.PI / 180); },
        R = 6371,
        dLat = deg2rad(client.lat - station.lat),
        dLng = deg2rad(client.lng - station.lng),
        a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.cos(deg2rad(station.lat))
            * Math.cos(deg2rad(station.lat))
            * Math.sin(dLng / 2) * Math.sin(dLng / 2),
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return parseInt(((R * c * 1000).toFixed()));
}

async function findClosestStation() {
    $("#progressbarSky").show(0);

    clientCrd = {
        lat: $("#geolocation").val().substr(0, $("#geolocation").val().indexOf(" ")),
        lng: $("#geolocation").val().substr($("#geolocation").val().indexOf(" ") + 1)
    };

    if (Object.values(clientCrd).length == 0)
        return true;

    $("#map_container").remove();

    $("#map").html('<div id="map_container" style="width: auto; height: 300px; border-radius: 5px""></div>');

    var closestDist = 9999999999999;
    var closestStation = {};
    var dist = 0;
    var offset = $("#offset_time").val();

    var date = new Date($("#date_sky").val() + " " + $("#time_begin_sky").val());

    if (offset != "") {
        var date_begin = dateAdd(date, 'minute', -offset);
        var date_end = dateAdd(date, 'minute', offset);
        var date_begin_str = dateToString(date_begin);
        var date_end_str = dateToString(date_end);
    }
    else {
        var date_begin = dateAdd(date, 'minute', -30);
        var date_end = dateAdd(date, 'minute', 30);
        var date_begin_str = dateToString(date_begin);
        var date_end_str = dateToString(date_end);
    }

    if (date == "" || date_begin_str == "" || date_end_str == "") {
        presentAlertError();
        $("#progressbarSky").hide(0);
        return true;
    }

    $.ajax({
        async: true,
        url: url2,
        dataType: 'json',
        data: {
            date_begin: date_begin_str,
            date_end: date_end_str,
            mode: "json",
            key: "cb9fe2c0ec0c4b85032000937a8198d8"
        },
        success: function map(data) {

            function makePopupText(st) {
                var str = "Station: " + st.name + "<br/>" +
                    "Latitude: " + st.lat_.substr(0, 7) + "<br/>" +
                    "Longitude: " + st.long_.substr(0, 7) + "<br/>";
                return (str);
            }

            // Mapa
            var map = L.map('map_container')

            // Icones
            var unespIcon = L.icon({
                iconUrl: '../../assets/marker/active.png',
                iconSize: [16, 28],
                iconAnchor: [5, 28],
                popupAnchor: [2, -27]
            });

            L.control.scale().addTo(map);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            for (var i = 0; i < data.length; i++) {
                if (data[i].lat_ !== null && data[i].long_ !== null) {
                    var stationCrd = {};

                    stationCrd.lat = parseFloat(data[i].lat_);
                    stationCrd.lng = parseFloat(data[i].long_);
                    dist = getDistance(clientCrd, stationCrd);

                    if (dist < closestDist) {
                        closestDist = dist;
                        closestStation.i = i;
                        closestStation.name = data[i].name;
                        closestStation.lat_ = data[i].lat_.substr(0, 8);
                        closestStation.long_ = data[i].long_.substr(0, 8);
                        closestStation.date_b = date_begin_str;
                        closestStation.date_e = date_end_str;
                    }
                }
            }

            for (var i = 0; i < data.length; i++) {
                if (data[i].lat_ !== null && data[i].long_ !== null) {
                    if (i != closestStation.i) {
                        var oneMarker = L.marker([data[i].lat_, data[i].long_], { icon: unespIcon })
                            .addTo(map)
                            .bindPopup(makePopupText(data[i]))
                            .on("click", markerLayerClick);

                        oneMarker.date_b = date_begin_str;
                        oneMarker.date_e = date_end_str;
                        oneMarker.stationName = data[i].name;
                    }
                    else {
                        map.setView([closestStation.lat_, closestStation.long_], 16);
                        var marker = L.marker([closestStation.lat_, closestStation.long_], { icon: unespIcon })
                            .addTo(map)
                            .bindPopup(makePopupText(closestStation))
                            .openPopup()
                            .on("click", markerLayerClick);

                        marker.date_b = closestStation.date_b;
                        marker.date_e = closestStation.date_e;
                        marker.stationName = closestStation.name;
                    }
                }
            }

            // var marker = L.marker([closestStation.lat_, closestStation.long_], { icon: unespIcon })
            //     .addTo(map)
            //     .bindPopup(makePopupText(closestStation))
            //     .openPopup()
            //     .on("click", markerLayerClick);

            // marker.date_b = closestStation.date_b;
            // marker.date_e = closestStation.date_e;
            // marker.stationName = closestStation.name;


        },
        error: function () {
            presentAlertError();
            $("#progressbarSky").hide(0);
            return true;
        }
    });
    $("#progressbarSky").hide(0);
}