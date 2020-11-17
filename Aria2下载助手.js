// ==UserScript==
// @namespace zyxubing
// @name Aria2下载助手
// @description 纯净无广告 配合aria2使用
// @version 0.2.10.20191120
// @include https://pan.baidu.com/*
// @include https://yun.baidu.com/*
// @include https://wallhaven.cc/*
// @include https://www.bilibili.com/video/av*
// @include https://www.bilibili.com/bangumi/play/*
// @include https://live.bilibili.com/*
// @include https://space.bilibili.com/*
// @include https://search.bilibili.com/*
// @grant GM_xmlhttpRequest
// @grant GM_setClipboard
// @run-at document-idle
// ==/UserScript==
! function () {
    const ipod = {},
        u = {
            aria2(e, t = "http://127.0.0.1:6800/jsonrpc") {
                let o = [],
                    n = {
                        id: u.uid(),
                        method: "system.multicall",
                        params: []
                    };
                e.forEach(e => {
                    let t = {},
                        a = {
                            methodName: "aria2.addUri",
                            params: []
                        };
                    e.header && (t["use-head"] = "true", t.header = e.header), e.dir && (t.dir = e.dir);
                    e.path && (t.out = e.path.replace(/\s+\/\s+/g, "/")), e.extype && (t.out = n.id + e.extype);
                    ipod.aria2.token && a.params.push("token:" + ipod.aria2.token), a.params.push(e.url);
                    t.split = "" + e.url.length, a.params.push(t);
                    o.push(a)
                }), n.params.push(o);
                GM_xmlhttpRequest({
                    url: t,
                    method: "POST",
                    data: JSON.stringify(n),
                    ontimeout() {
                        alert("\u8fde\u63a5jsonrpc\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5aria2\u662f\u5426\u8fd0\u884c\u548cjsonrpc\u5730\u5740\u53caaria2\u8bbf\u95ee\u53e3\u4ee4\u662f\u5426\u586b\u5199\u6b63\u786e\u3002")
                    }
                })
            },
            now: () => (new Date).getTime(),
            uid: () => u.now().toString(36),
            zdom(e = 0) {
                let t = window.event;
                return t.preventDefault(), t.stopPropagation(), e ? t.target : t.currentTarget
            },
            zform(e, t) {
                document.querySelectorAll(e).forEach(e => {
                    let o = e.getAttribute("name");
                    if (t[o]) switch (e.getAttribute("type")) {
                        case "radio":
                        case "checkbox":
                            t[o].includes(e.value) && (e.checked = !0);
                            break;
                        default:
                            e.value = t[o]
                    }
                })
            },
            load(e) {
                let t = u.now(),
                    o = JSON.parse(localStorage.getItem(e));
                return Object.prototype.isPrototypeOf(o) && (0 == o.expire || o.expir > t) ? o.data : null
            },
            save(e, t, o = 0) {
                let n = u.now();
                localStorage.setItem(e, JSON.stringify({
                    data: t,
                    expire: o ? 216e5 * o + n : 0
                }))
            },
            serialize(e, t) {
                let o, n, a = [];
                switch (typeof e) {
                    case "object":
                        if ("[object Array]" == (n = Object.prototype.toString.call(e)) || "[object Object]" == n)
                            for (o in e) Object.prototype.hasOwnProperty.call(e, o) && a.push(u.serialize(e[o], t ? t + "[" + o + "]" : o));
                        return 0 == a.length ? "" : a.join("&");
                    default:
                        return t + "=" + encodeURIComponent("" + e)
                }
            },
            strcut(e, t, o) {
                let n, a, f = "";
                if (e && e.includes(t)) {
                    n = e.indexOf(t) + t.length, -1 == (a = e.indexOf(o, n)) && (a = e.length);
                    f = e.substring(n, a)
                }
                return f
            },
            sprintf(e) {
                let t, o, n;
                if (o = "string" == typeof e ? e : "")
                    for (t = arguments.length - 1; t > 0; t--) n = RegExp("%" + t, "ig"), o = o.replace(n, arguments[t]);
                return o
            },
            download(e) {
                if (e) {
                    let t = [],
                        o = Object.assign(ipod.aria2);
                    o.url = [], e = e.startsWith("magnet:") ? u.magnet(e) : e.startsWith("http") ? e : e.startsWith("//") ? location.protocol + e : e.startsWith("/") ? location.origin + e : location.origin + "/" + e;
                    o.url.push(e), t.push(o);
                    u.aria2(t, ipod.aria2.jsonrpc)
                }
            },
            magnet(e) {
                let t = e.indexOf("&");
                return -1 == t ? e : e.substring(0, t)
            },
            history(e) {
                const t = history[e];
                return function () {
                    let o = new Event(e);
                    return o.arguments = arguments, null == o.explicitOriginalTarget && (autochangurl = 1), window.dispatchEvent(o), t.apply(this, arguments)
                }
            }
        };
    async function e(e) {
        if (0 == ipod.task) {
            ipod.list = [], ipod.task = setInterval(() => {
                if (ipod.len == ipod.list.length) {
                    clearInterval(ipod.task), ipod.task = 0;
                    "video" == ipod.type && ipod.aria2.cover && s(1 == ipod.count && 1 == ipod.len ? 0 : 1), u.aria2(ipod.list, ipod.aria2.jsonrpc);
                    ipod.adom.removeAttribute("style")
                }
            }, 1e3);
            let t = "https://api.bilibili.com/x/player/pagelist?aid=" + e,
                o = await fetch(t).then(e => e.json()).then(e => e.data[0].cid);
            t = u.sprintf("https://api.bilibili.com/x/web-interface/view?aid=%1&cid=%2", e, o);
            let n = await fetch(t).then(e => e.json()).then(t => {
                let o = [];
                if (0 == t.code) {
                    o = t.data.pages, ipod.type = "video";
                    ipod.url = "https://api.bilibili.com/x/player/playurl?avid=%1&cid=%2&qn=116", ipod.aid = e;
                    ipod.title = t.data.title, ipod.cover = t.data.pic
                }
                return o
            });
            ipod.count = ipod.len = n.length, p(n)
        }
    }
    async function t(e) {
        let t = await fetch("https://api.bilibili.com/x/player/pagelist?aid=" + e.aid).then(e => e.json()).then(e => e.data);
        ipod.vlistlen += t.length - 1, t.forEach(t => {
            ipod.vlist.push({
                aid: e.aid,
                cid: t.cid,
                mid: e.mid,
                part: t.page,
                created: e.created,
                duration: 15 * Math.floor(t.duration / 15)
            })
        })
    }
    async function o(e) {
        let t, o, n = "https://www.bilibili.com/video/av" + e.aid,
            a = u.strcut(document.cookie, "bili_jct=", ";"),
            f = {
                "Content-type": "application/x-www-form-urlencoded"
            };
        o = "https://api.bilibili.com/x/report/click/now", t = await fetch(o, {
            method: "GET",
            mode: "cors",
            credentials: "include",
            referrer: n
        }).then(e => e.json()).then(e => e.data.now);
        o = "https://api.bilibili.com/x/report/click/web/h5", await fetch(o, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: f,
            referrer: n,
            body: u.serialize({
                aid: e.aid,
                cid: e.cid,
                part: e.part,
                mid: e.mid,
                lv: 5,
                ftime: e.created,
                stime: t,
                jsonp: "jsonp",
                type: 3,
                sub_type: 0
            })
        });
        o = "https://api.bilibili.com/x/report/web/heartbeat", await fetch(o, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: f,
            referrer: n,
            body: u.serialize({
                aid: e.aid,
                cid: e.cid,
                mid: e.mid,
                csrf: a,
                played_time: 0,
                realtime: 0,
                start_ts: t,
                type: 3,
                dt: 2,
                play_type: 1
            })
        });
        o = "https://api.bilibili.com/x/report/web/heartbeat", await fetch(o, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: f,
            referrer: n,
            body: u.serialize({
                aid: e.aid,
                cid: e.cid,
                mid: e.mid,
                csrf: a,
                played_time: e.duration,
                realtime: e.duration,
                start_ts: t,
                type: 3,
                dt: 2,
                play_type: 0
            })
        });
        o = "https://api.bilibili.com/x/v2/history/delete", await fetch(o, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: f,
            referrer: "https://www.bilibili.com/account/history",
            body: "kid=archive_13637905&jsonp=jsonp&csrf=fef0caeb5e91bdafaae594099f80c335",
            body: u.serialize({
                kid: "archive_" + e.aid,
                jsonp: "jsonp",
                csrf: a
            })
        })
    }

    function n() {
        return u.strcut(decodeURIComponent(location.hash), "path=", "&")
    }

    function a(e) {
        let t = [],
            o = {
                timestamp: yunData.timestamp,
                uk: yunData.MYUK,
                dir: e
            };
        return e && $.ajax({
            async: !1,
            method: "GET",
            dataType: "json",
            url: location.origin + "/api/list",
            data: o,
            success(e) {
                t = 0 == e.errno ? e.list : []
            }
        }), t
    }

    function f() {
        let e = Math.floor(u.now() / 1e3);
        if (e > parseInt(localStorage.getItem("zlog") || 0))
            if (localStorage.setItem("zlog", e + 600), null == ipod.vlist || 0 == ipod.vlist.length) {
                let e = setInterval(() => {
                    if (ipod.vlistlen == ipod.vlist.length) {
                        clearInterval(e), u.save("vlist", ipod.vlist, 1);
                        ipod.vlist.forEach(o)
                    }
                }, 2e3);
                ipod.vlist = [], (async e => {
                    let o = await fetch(u.sprintf("https://api.bilibili.com/x/space/arc/search?mid=%1&ps=30&tid=0&pn=1&keyword=&order=pubdate", e), {
                        method: "GET",
                        mode: "cors",
                        credentials: "include",
                        referrer: "https://space.bilibili.com/20781212/video"
                    }).then(e => e.json()).then(e => e.data.list.vlist);
                    ipod.vlistlen = o.length, o.forEach(t)
                })(ipod.uid)
            } else ipod.vlist.forEach(o)
    }

    function r() {
        ipod.task = setInterval(() => {
            if ("function" == typeof jQuery && document.querySelector("ul.video-list")) {
                clearInterval(ipod.task), ipod.task = 0;
                $("ul.video-list").on("click", () => {
                    if (window.event.altKey) {
                        ipod.adom = u.zdom(1);
                        while ("li" != ipod.adom.tagName.toLowerCase()) ipod.adom = ipod.adom.parentElement;
                        ipod.adom.setAttribute("style", "visibility: hidden"), e(ipod.adom.children[0].getAttribute("href").match(/av(\d+)/)[1])
                    }
                })
            }
        }, 1e3)
    }

    function i() {
        setTimeout(() => {
            location.pathname.endsWith("/favlist") && (ipod.task = setInterval(() => {
                if (document.querySelector("ul.fav-video-list") && (clearInterval(ipod.task), ipod.task = 0, !document.querySelector("#zydl"))) {
                    $("div.fav-filters").prepend('<div class="filter-item"><span id="zydl" class="text"><i class="fa-download"></i> \u5168\u90e8\u4e0b\u8f7d</span></div>'), $("#zydl").on("click", b);
                    $("ul.fav-video-list").on("click", m)
                }
            }, 1e3)), location.pathname.endsWith("/video") && (ipod.task = setInterval(() => {
                if (document.querySelector("ul.cube-list") && (clearInterval(ipod.task), ipod.task = 0, !document.querySelector("#zydl"))) {
                    $("ul.be-tab-inner").append('<li class="be-tab-item"><span id="zydl"><i class="fa-download"></i> \u5168\u90e8\u4e0b\u8f7d</span></li>'), $("#zydl").on("click", b);
                    $("ul.cube-list").on("click", m)
                }
            }, 1e3))
        }, 1e3)
    }

    function c() {
        let e = setInterval(() => {
            let t = document.querySelector("input.bui-checkbox");
            t && (clearInterval(e), t.checked && t.click())
        }, 3e3)
    }

    function l() {
        fetch(u.sprintf(ipod.url, ipod.aid, ipod.cid)).then(e => e.json()).then(e => {
            if (0 == e.code) {
                let t, o = [];
                f(), e.durl.forEach(e => {
                    t = {
                        duration: e.length,
                        filesize: e.size,
                        url: e.url.replace("http:", "https:")
                    }, o.push(t)
                });
                ((e, t) => {
                    if (flvjs.isSupported()) {
                        if (x) {
                            x.unload(), x.detachMediaElement();
                            x.destroy()
                        }
                        if (x = flvjs.createPlayer({
                                cors: !0,
                                type: e,
                                segments: t
                            })) {
                            x.attachMediaElement(document.querySelector("#bplayer")), x.load();
                            x.play()
                        }
                    }
                })(e.format, o)
            } else alert("\u4ee3\u7406\u670d\u52a1\u5668\u4e0a\u6ca1\u6709\u5927\u4f1a\u5458\u8d26\u53f7\u8fdb\u884c\u89e3\u6790\u64ad\u653e\u5730\u5740")
        })
    }

    function d() {
        let e = u.zdom();
        ipod.aid = e.getAttribute("data-aid"), ipod.cid = e.getAttribute("data-cid");
        l()
    }

    function s(e) {
        ipod.len++;
        let t = {
            dir: ipod.aria2.video,
            folder: e ? ipod.aid : "",
            file: ipod.aid + ".jpg",
            url: [ipod.cover]
        };
        t.path = t.folder ? t.folder + "/" + t.file : t.file, ipod.list.push(t)
    }

    function b() {
        let t = document.querySelectorAll("ul.fav-video-list>li") || document.querySelectorAll("ul.cube-list>li"),
            o = t.length,
            n = 0,
            a = setInterval(() => {
                n == o ? (clearInterval(a), document.querySelector("#zydl>i").setAttribute("class", "fa-download")) : 0 == ipod.task && (e(t[n].getAttribute("data-aid")), n++)
            }, 1e3);
        document.querySelector("#zydl>i").setAttribute("class", "fa-refresh spinner")
    }

    function p(e) {
        e.forEach(e => {
            fetch(u.sprintf(ipod.url, ipod.aid, e.cid), {
                method: "GET",
                mode: "cors",
                credentials: "include"
            }).then(e => e.json()).then(t => {
                if (0 == t.code) {
                    let o = t.data.durl,
                        n = o.length;
                    ipod.len += n - 1, o.forEach(t => {
                        let o = {
                            url: [],
                            header: ipod.header,
                            dir: ipod.aria2.video
                        };
                        Array.isArray(t.backup_url) && (o.url = t.backup_url), o.url.push(t.url);
                        o.folder = 1 == ipod.count && 1 == n ? "" : ipod.aid, o.file = 1 == ipod.count ? 1 == n ? ipod.aid + ".flv" : g(t.order) + ".flv" : 1 == n ? g(e.page) + " " + e.part + ".flv" : g(e.page) + " " + e.part + " " + g(t.order) + ".flv";
                        o.path = o.folder ? o.folder + "/" + o.file : o.file, ipod.list.push(o)
                    })
                } else ipod.len--
            })
        })
    }

    function m() {
        if (window.event.altKey) {
            ipod.adom = u.zdom(1);
            while ("li" != ipod.adom.tagName.toLowerCase()) ipod.adom = ipod.adom.parentElement;
            ipod.adom.setAttribute("style", "visibility: hidden"), e(ipod.adom.getAttribute("data-aid"))
        }
    }

    function h(e) {
        e.forEach(e => {
            fetch(u.sprintf(ipod.url, ipod.aid, e.cid), {
                method: "GET",
                mode: "cors",
                credentials: "include"
            }).then(e => e.json()).then(t => {
                if (0 == t.code) {
                    let o = ipod.area ? t.durl : t.result.durl,
                        n = o.length;
                    ipod.len += n - 1, o.forEach(t => {
                        let o = {
                            url: [],
                            header: ipod.header,
                            dir: ipod.aria2.anime
                        };
                        Array.isArray(t.backup_url) && (o.url = t.backup_url), o.url.push(t.url);
                        o.folder = 1 == ipod.count && 1 == n ? "" : ipod.title, o.file = 1 == ipod.count ? 1 == n ? ipod.title + ".flv" : g(t.order) + ".flv" : 1 == n ? g(e.title) + " " + e.longTitle + ".flv" : g(e.title) + " " + e.longTitle + " " + g(t.order) + ".flv";
                        o.path = o.folder ? o.folder + "/" + o.file : o.file, ipod.list.push(o)
                    })
                } else ipod.len--
            })
        })
    }

    function y() {
        $("#zylist li").on("click", () => {
            let e = u.zdom();
            $(e).toggleClass("on")
        }), $("#zylist button").on("click", () => {
            switch (u.zdom().getAttribute("name")) {
                case "settings":
                    k();
                    break;
                case "all":
                    $("#zylist li").each((e, t) => {
                        $(t).addClass("on")
                    });
                    break;
                case "invert":
                    $("#zylist li").each((e, t) => {
                        $(t).toggleClass("on")
                    });
                    break;
                default:
                    let e = [],
                        t = [],
                        o = __INITIAL_STATE__;
                    $("#zylist li").each((t, o) => {
                        let n = $(o);
                        n.hasClass("on") && e.push(n.attr("name"))
                    }), ipod.len = e.length;
                    ipod.list = [], $("#zylist").fadeOut();
                    "video" == ipod.type && (o.videoData.pages.forEach(o => {
                        e.includes("" + o.cid) && t.push(o)
                    }), p(t)), "anime" == ipod.type && (o.epList.forEach(o => {
                        e.includes("" + o.cid) && t.push(o)
                    }), h(t))
            }
        })
    }

    function v() {
        let e, t = u.zdom();
        if (0 == ipod.task) {
            if (e = __INITIAL_STATE__, document.querySelector("#zydl>i").setAttribute("style", "color: #fb7299"), ipod.list = [], ipod.task = setInterval(() => {
                    if (ipod.len == ipod.list.length)
                        if (clearInterval(ipod.task), ipod.task = 0, document.querySelector("#zydl>i").removeAttribute("style"), "video" == ipod.type && ipod.aria2.cover && s(1 == ipod.count && 1 == ipod.len ? 0 : 1), ipod.aria2.getlink) {
                            let e = [];
                            ipod.list.forEach(t => {
                                e.push(t.url[0])
                            }), GM_setClipboard(e.join("\r\n"), "text")
                        } else u.aria2(ipod.list, ipod.aria2.jsonrpc)
                }, 1e3), e.videoData)
                if (ipod.type = "video", ipod.url = "https://api.bilibili.com/x/player/playurl?avid=%1&cid=%2&qn=116", ipod.aid = e.videoData.aid, ipod.title = e.videoData.title, ipod.cover = e.videoData.pic, ipod.count = ipod.len = e.videoData.pages.length, 1 == ipod.count) p(e.videoData.pages);
                else {
                    let o = '<div> <div class="btn-group full"> <button name="settings"> <i class="fa-settings"></i> \u8bbe\u7f6e </button> <button name="all"> \u5168\u9009 </button> <button name="invert"> \u53cd\u9009 </button> <button name="download"> <i class="fa-download"></i> \u4e0b\u8f7d </button> </div> <ul>';
                    if (t = document.querySelector("#zylist")) t.setAttribute("style", "display: flex");
                    else {
                        t = document.createElement("div"), document.body.insertAdjacentElement("beforeend", t);
                        t.setAttribute("class", "tamper"), t.setAttribute("id", "zylist")
                    }
                    e.videoData.pages.forEach(e => {
                        o += u.sprintf('<li name="%1">%2</li>', e.cid, g(e.page) + " " + e.part)
                    }), t.innerHTML = o + "</ul> </div>";
                    y()
                } if (e.mediaInfo)
                if (ipod.type = "anime", ipod.area = __PGC_USERSTATE__.area_limit, ipod.url = ipod.area ? "https://www.biliplus.com/BPplayurl.php?aid=%1&cid=%2&qn=116&otype=json&module=bangumi" : "https://api.bilibili.com/pgc/player/web/playurl?avid=%1&cid=%2&qn=116", ipod.title = e.mediaInfo.title, ipod.cover = e.mediaInfo.cover, ipod.count = ipod.len = e.epList.length, 1 == ipod.count) h(e.epList);
                else {
                    let o = '<div> <div class="btn-group full"> <button name="settings"> <i class="fa-settings"></i> \u8bbe\u7f6e </button> <button name="all"> \u5168\u9009 </button> <button name="invert"> \u53cd\u9009 </button> <button name="download"> <i class="fa-download"></i> \u4e0b\u8f7d </button> </div> <ul>';
                    if (t = document.querySelector("#zylist")) t.setAttribute("style", "display: flex");
                    else {
                        t = document.createElement("div"), document.body.insertAdjacentElement("beforeend", t);
                        t.setAttribute("class", "tamper"), t.setAttribute("id", "zylist")
                    }
                    e.epList.forEach(e => {
                        o += u.sprintf('<li name="%1">%2</li>', e.cid, g(e.title) + " " + e.longTitle)
                    }), t.innerHTML = o + "</ul> </div>";
                    y()
                }
        }
    }

    function g(e) {
        let t = +e;
        return isNaN(t) && (t = 0), (t = "0" + t).substring(t.length - 2)
    }

    function w() {
        document.head.insertAdjacentHTML("beforeend", '<style type="text/css">@font-face{font-family:"Ionicons";src:url("https://cdn.bootcss.com/ionicons/4.5.6/fonts/ionicons.eot?v=4.5.5#iefix") format("embedded-opentype"),url("https://cdn.bootcss.com/ionicons/4.5.6/fonts/ionicons.woff2?v=4.5.5") format("woff2"),url("https://cdn.bootcss.com/ionicons/4.5.6/fonts/ionicons.woff?v=4.5.5") format("woff"),url("https://cdn.bootcss.com/ionicons/4.5.6/fonts/ionicons.ttf?v=4.5.5") format("truetype"),url("https://cdn.bootcss.com/ionicons/4.5.6/fonts/ionicons.svg?v=4.5.5#Ionicons") format("svg");font-weight:normal;font-style:normal}i[class|=fa]{display:inline-block;font-family:"Ionicons";font-size:120%;font-style:normal;font-variant:normal;font-weight:normal;line-height:1;text-rendering:auto;text-transform:none;vertical-align:text-bottom;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased}.fa-android:before{content:"\\f225"}.fa-angular:before{content:"\\f227"}.fa-apple:before{content:"\\f229"}.fa-bitbucket:before{content:"\\f193"}.fa-bitcoin:before{content:"\\f22b"}.fa-buffer:before{content:"\\f22d"}.fa-chrome:before{content:"\\f22f"}.fa-closed-captioning:before{content:"\\f105"}.fa-codepen:before{content:"\\f230"}.fa-css3:before{content:"\\f231"}.fa-designernews:before{content:"\\f232"}.fa-dribbble:before{content:"\\f233"}.fa-dropbox:before{content:"\\f234"}.fa-euro:before{content:"\\f235"}.fa-facebook:before{content:"\\f236"}.fa-flickr:before{content:"\\f107"}.fa-foursquare:before{content:"\\f237"}.fa-freebsd-devil:before{content:"\\f238"}.fa-game-controller-a:before{content:"\\f13b"}.fa-game-controller-b:before{content:"\\f181"}.fa-github:before{content:"\\f239"}.fa-google:before{content:"\\f23a"}.fa-googleplus:before{content:"\\f23b"}.fa-hackernews:before{content:"\\f23c"}.fa-html5:before{content:"\\f23d"}.fa-instagram:before{content:"\\f23e"}.fa-ionic:before{content:"\\f150"}.fa-ionitron:before{content:"\\f151"}.fa-javascript:before{content:"\\f23f"}.fa-linkedin:before{content:"\\f240"}.fa-markdown:before{content:"\\f241"}.fa-model-s:before{content:"\\f153"}.fa-no-smoking:before{content:"\\f109"}.fa-nodejs:before{content:"\\f242"}.fa-npm:before{content:"\\f195"}.fa-octocat:before{content:"\\f243"}.fa-pinterest:before{content:"\\f244"}.fa-playstation:before{content:"\\f245"}.fa-polymer:before{content:"\\f15e"}.fa-python:before{content:"\\f246"}.fa-reddit:before{content:"\\f247"}.fa-rss:before{content:"\\f248"}.fa-sass:before{content:"\\f249"}.fa-skype:before{content:"\\f24a"}.fa-slack:before{content:"\\f10b"}.fa-snapchat:before{content:"\\f24b"}.fa-steam:before{content:"\\f24c"}.fa-tumblr:before{content:"\\f24d"}.fa-tux:before{content:"\\f2ae"}.fa-twitch:before{content:"\\f2af"}.fa-twitter:before{content:"\\f2b0"}.fa-usd:before{content:"\\f2b1"}.fa-vimeo:before{content:"\\f2c4"}.fa-vk:before{content:"\\f10d"}.fa-whatsapp:before{content:"\\f2c5"}.fa-windows:before{content:"\\f32f"}.fa-wordpress:before{content:"\\f330"}.fa-xbox:before{content:"\\f34c"}.fa-xing:before{content:"\\f10f"}.fa-yahoo:before{content:"\\f34d"}.fa-yen:before{content:"\\f34e"}.fa-youtube:before{content:"\\f34f"}.fa-add:before{content:"\\f273"}.fa-add-circle:before{content:"\\f272"}.fa-add-circle-outline:before{content:"\\f158"}.fa-airplane:before{content:"\\f15a"}.fa-alarm:before{content:"\\f274"}.fa-albums:before{content:"\\f275"}.fa-alert:before{content:"\\f276"}.fa-american-football:before{content:"\\f277"}.fa-analytics:before{content:"\\f278"}.fa-aperture:before{content:"\\f279"}.fa-apps:before{content:"\\f27a"}.fa-appstore:before{content:"\\f27b"}.fa-archive:before{content:"\\f27c"}.fa-arrow-back:before{content:"\\f27d"}.fa-arrow-down:before{content:"\\f27e"}.fa-arrow-dropdown:before{content:"\\f280"}.fa-arrow-dropdown-circle:before{content:"\\f27f"}.fa-arrow-dropleft:before{content:"\\f282"}.fa-arrow-dropleft-circle:before{content:"\\f281"}.fa-arrow-dropright:before{content:"\\f284"}.fa-arrow-dropright-circle:before{content:"\\f283"}.fa-arrow-dropup:before{content:"\\f286"}.fa-arrow-dropup-circle:before{content:"\\f285"}.fa-arrow-forward:before{content:"\\f287"}.fa-arrow-round-back:before{content:"\\f288"}.fa-arrow-round-down:before{content:"\\f289"}.fa-arrow-round-forward:before{content:"\\f28a"}.fa-arrow-round-up:before{content:"\\f28b"}.fa-arrow-up:before{content:"\\f28c"}.fa-at:before{content:"\\f28d"}.fa-attach:before{content:"\\f28e"}.fa-backspace:before{content:"\\f28f"}.fa-barcode:before{content:"\\f290"}.fa-baseball:before{content:"\\f291"}.fa-basket:before{content:"\\f292"}.fa-basketball:before{content:"\\f293"}.fa-battery-charging:before{content:"\\f294"}.fa-battery-dead:before{content:"\\f295"}.fa-battery-full:before{content:"\\f296"}.fa-beaker:before{content:"\\f297"}.fa-bed:before{content:"\\f160"}.fa-beer:before{content:"\\f298"}.fa-bicycle:before{content:"\\f299"}.fa-bluetooth:before{content:"\\f29a"}.fa-boat:before{content:"\\f29b"}.fa-body:before{content:"\\f29c"}.fa-bonfire:before{content:"\\f29d"}.fa-book:before{content:"\\f29e"}.fa-bookmark:before{content:"\\f29f"}.fa-bookmarks:before{content:"\\f2a0"}.fa-bowtie:before{content:"\\f2a1"}.fa-briefcase:before{content:"\\f2a2"}.fa-browsers:before{content:"\\f2a3"}.fa-brush:before{content:"\\f2a4"}.fa-bug:before{content:"\\f2a5"}.fa-build:before{content:"\\f2a6"}.fa-bulb:before{content:"\\f2a7"}.fa-bus:before{content:"\\f2a8"}.fa-business:before{content:"\\f1a4"}.fa-cafe:before{content:"\\f2a9"}.fa-calculator:before{content:"\\f2aa"}.fa-calendar:before{content:"\\f2ab"}.fa-call:before{content:"\\f2ac"}.fa-camera:before{content:"\\f2ad"}.fa-car:before{content:"\\f2b2"}.fa-card:before{content:"\\f2b3"}.fa-cart:before{content:"\\f2b4"}.fa-cash:before{content:"\\f2b5"}.fa-cellular:before{content:"\\f164"}.fa-chatboxes:before{content:"\\f2b6"}.fa-chatbubbles:before{content:"\\f2b7"}.fa-checkbox:before{content:"\\f2b9"}.fa-checkbox-outline:before{content:"\\f2b8"}.fa-checkmark:before{content:"\\f2bc"}.fa-checkmark-circle:before{content:"\\f2bb"}.fa-checkmark-circle-outline:before{content:"\\f2ba"}.fa-clipboard:before{content:"\\f2bd"}.fa-clock:before{content:"\\f2be"}.fa-close:before{content:"\\f2c0"}.fa-close-circle:before{content:"\\f2bf"}.fa-close-circle-outline:before{content:"\\f166"}.fa-cloud:before{content:"\\f2c9"}.fa-cloud-circle:before{content:"\\f2c2"}.fa-cloud-done:before{content:"\\f2c3"}.fa-cloud-download:before{content:"\\f2c6"}.fa-cloud-outline:before{content:"\\f2c7"}.fa-cloud-upload:before{content:"\\f2c8"}.fa-cloudy:before{content:"\\f2cb"}.fa-cloudy-night:before{content:"\\f2ca"}.fa-code:before{content:"\\f2ce"}.fa-code-download:before{content:"\\f2cc"}.fa-code-working:before{content:"\\f2cd"}.fa-cog:before{content:"\\f2cf"}.fa-color-fill:before{content:"\\f2d0"}.fa-color-filter:before{content:"\\f2d1"}.fa-color-palette:before{content:"\\f2d2"}.fa-color-wand:before{content:"\\f2d3"}.fa-compass:before{content:"\\f2d4"}.fa-construct:before{content:"\\f2d5"}.fa-contact:before{content:"\\f2d6"}.fa-contacts:before{content:"\\f2d7"}.fa-contract:before{content:"\\f2d8"}.fa-contrast:before{content:"\\f2d9"}.fa-copy:before{content:"\\f2da"}.fa-create:before{content:"\\f2db"}.fa-crop:before{content:"\\f2dc"}.fa-cube:before{content:"\\f2dd"}.fa-cut:before{content:"\\f2de"}.fa-desktop:before{content:"\\f2df"}.fa-disc:before{content:"\\f2e0"}.fa-document:before{content:"\\f2e1"}.fa-done-all:before{content:"\\f2e2"}.fa-download:before{content:"\\f2e3"}.fa-easel:before{content:"\\f2e4"}.fa-egg:before{content:"\\f2e5"}.fa-exit:before{content:"\\f2e6"}.fa-expand:before{content:"\\f2e7"}.fa-eye:before{content:"\\f2e9"}.fa-eye-off:before{content:"\\f2e8"}.fa-fastforward:before{content:"\\f2ea"}.fa-female:before{content:"\\f2eb"}.fa-filing:before{content:"\\f2ec"}.fa-film:before{content:"\\f2ed"}.fa-finger-print:before{content:"\\f2ee"}.fa-fitness:before{content:"\\f1ac"}.fa-flag:before{content:"\\f2ef"}.fa-flame:before{content:"\\f2f0"}.fa-flash:before{content:"\\f17e"}.fa-flash-off:before{content:"\\f12f"}.fa-flashlight:before{content:"\\f16b"}.fa-flask:before{content:"\\f2f2"}.fa-flower:before{content:"\\f2f3"}.fa-folder:before{content:"\\f2f5"}.fa-folder-open:before{content:"\\f2f4"}.fa-football:before{content:"\\f2f6"}.fa-funnel:before{content:"\\f2f7"}.fa-gift:before{content:"\\f199"}.fa-git-branch:before{content:"\\f2fa"}.fa-git-commit:before{content:"\\f2fb"}.fa-git-compare:before{content:"\\f2fc"}.fa-git-merge:before{content:"\\f2fd"}.fa-git-network:before{content:"\\f2fe"}.fa-git-pull-request:before{content:"\\f2ff"}.fa-glasses:before{content:"\\f300"}.fa-globe:before{content:"\\f301"}.fa-grid:before{content:"\\f302"}.fa-hammer:before{content:"\\f303"}.fa-hand:before{content:"\\f304"}.fa-happy:before{content:"\\f305"}.fa-headset:before{content:"\\f306"}.fa-heart:before{content:"\\f308"}.fa-heart-dislike:before{content:"\\f167"}.fa-heart-empty:before{content:"\\f1a1"}.fa-heart-half:before{content:"\\f1a2"}.fa-help:before{content:"\\f30b"}.fa-help-buoy:before{content:"\\f309"}.fa-help-circle:before{content:"\\f30a"}.fa-help-circle-outline:before{content:"\\f16d"}.fa-home:before{content:"\\f30c"}.fa-hourglass:before{content:"\\f111"}.fa-ice-cream:before{content:"\\f30d"}.fa-image:before{content:"\\f30e"}.fa-images:before{content:"\\f30f"}.fa-infinite:before{content:"\\f310"}.fa-information:before{content:"\\f312"}.fa-information-circle:before{content:"\\f311"}.fa-information-circle-outline:before{content:"\\f16f"}.fa-jet:before{content:"\\f315"}.fa-journal:before{content:"\\f18d"}.fa-key:before{content:"\\f316"}.fa-keypad:before{content:"\\f317"}.fa-laptop:before{content:"\\f318"}.fa-leaf:before{content:"\\f319"}.fa-link:before{content:"\\f22e"}.fa-list:before{content:"\\f31b"}.fa-list-box:before{content:"\\f31a"}.fa-locate:before{content:"\\f31c"}.fa-lock:before{content:"\\f31d"}.fa-log-in:before{content:"\\f31e"}.fa-log-out:before{content:"\\f31f"}.fa-magnet:before{content:"\\f320"}.fa-mail:before{content:"\\f322"}.fa-mail-open:before{content:"\\f321"}.fa-mail-unread:before{content:"\\f172"}.fa-male:before{content:"\\f323"}.fa-man:before{content:"\\f324"}.fa-map:before{content:"\\f325"}.fa-medal:before{content:"\\f326"}.fa-medical:before{content:"\\f327"}.fa-medkit:before{content:"\\f328"}.fa-megaphone:before{content:"\\f329"}.fa-menu:before{content:"\\f32a"}.fa-mic:before{content:"\\f32c"}.fa-mic-off:before{content:"\\f32b"}.fa-microphone:before{content:"\\f32d"}.fa-moon:before{content:"\\f32e"}.fa-more:before{content:"\\f1c9"}.fa-move:before{content:"\\f331"}.fa-musical-note:before{content:"\\f332"}.fa-musical-notes:before{content:"\\f333"}.fa-navigate:before{content:"\\f334"}.fa-notifications:before{content:"\\f338"}.fa-notifications-off:before{content:"\\f336"}.fa-notifications-outline:before{content:"\\f337"}.fa-nuclear:before{content:"\\f339"}.fa-nutrition:before{content:"\\f33a"}.fa-open:before{content:"\\f33b"}.fa-options:before{content:"\\f33c"}.fa-outlet:before{content:"\\f33d"}.fa-paper:before{content:"\\f33f"}.fa-paper-plane:before{content:"\\f33e"}.fa-partly-sunny:before{content:"\\f340"}.fa-pause:before{content:"\\f341"}.fa-paw:before{content:"\\f342"}.fa-people:before{content:"\\f343"}.fa-person:before{content:"\\f345"}.fa-person-add:before{content:"\\f344"}.fa-phone-landscape:before{content:"\\f346"}.fa-phone-portrait:before{content:"\\f347"}.fa-photos:before{content:"\\f348"}.fa-pie:before{content:"\\f349"}.fa-pin:before{content:"\\f34a"}.fa-pint:before{content:"\\f34b"}.fa-pizza:before{content:"\\f354"}.fa-planet:before{content:"\\f356"}.fa-play:before{content:"\\f357"}.fa-play-circle:before{content:"\\f174"}.fa-podium:before{content:"\\f358"}.fa-power:before{content:"\\f359"}.fa-pricetag:before{content:"\\f35a"}.fa-pricetags:before{content:"\\f35b"}.fa-print:before{content:"\\f35c"}.fa-pulse:before{content:"\\f35d"}.fa-qr-scanner:before{content:"\\f35e"}.fa-quote:before{content:"\\f35f"}.fa-radio:before{content:"\\f362"}.fa-radio-button-off:before{content:"\\f360"}.fa-radio-button-on:before{content:"\\f361"}.fa-rainy:before{content:"\\f363"}.fa-recording:before{content:"\\f364"}.fa-redo:before{content:"\\f365"}.fa-refresh:before{content:"\\f366"}.fa-refresh-circle:before{content:"\\f228"}.fa-remove:before{content:"\\f368"}.fa-remove-circle:before{content:"\\f367"}.fa-remove-circle-outline:before{content:"\\f176"}.fa-reorder:before{content:"\\f369"}.fa-repeat:before{content:"\\f36a"}.fa-resize:before{content:"\\f36b"}.fa-restaurant:before{content:"\\f36c"}.fa-return-left:before{content:"\\f36d"}.fa-return-right:before{content:"\\f36e"}.fa-reverse-camera:before{content:"\\f36f"}.fa-rewind:before{content:"\\f370"}.fa-ribbon:before{content:"\\f371"}.fa-rocket:before{content:"\\f179"}.fa-rose:before{content:"\\f372"}.fa-sad:before{content:"\\f373"}.fa-save:before{content:"\\f1a9"}.fa-school:before{content:"\\f374"}.fa-search:before{content:"\\f375"}.fa-send:before{content:"\\f376"}.fa-settings:before{content:"\\f377"}.fa-share:before{content:"\\f379"}.fa-share-alt:before{content:"\\f378"}.fa-shirt:before{content:"\\f37a"}.fa-shuffle:before{content:"\\f37b"}.fa-skip-backward:before{content:"\\f37c"}.fa-skip-forward:before{content:"\\f37d"}.fa-snow:before{content:"\\f37e"}.fa-speedometer:before{content:"\\f37f"}.fa-square:before{content:"\\f381"}.fa-square-outline:before{content:"\\f380"}.fa-star:before{content:"\\f384"}.fa-star-half:before{content:"\\f382"}.fa-star-outline:before{content:"\\f383"}.fa-stats:before{content:"\\f385"}.fa-stopwatch:before{content:"\\f386"}.fa-subway:before{content:"\\f387"}.fa-sunny:before{content:"\\f388"}.fa-swap:before{content:"\\f389"}.fa-switch:before{content:"\\f38a"}.fa-sync:before{content:"\\f38b"}.fa-tablet-landscape:before{content:"\\f38c"}.fa-tablet-portrait:before{content:"\\f38d"}.fa-tennisball:before{content:"\\f38e"}.fa-text:before{content:"\\f38f"}.fa-thermometer:before{content:"\\f390"}.fa-thumbs-down:before{content:"\\f391"}.fa-thumbs-up:before{content:"\\f392"}.fa-thunderstorm:before{content:"\\f393"}.fa-time:before{content:"\\f394"}.fa-timer:before{content:"\\f395"}.fa-today:before{content:"\\f17d"}.fa-train:before{content:"\\f396"}.fa-transgender:before{content:"\\f397"}.fa-trash:before{content:"\\f398"}.fa-trending-down:before{content:"\\f399"}.fa-trending-up:before{content:"\\f39a"}.fa-trophy:before{content:"\\f39b"}.fa-tv:before{content:"\\f17f"}.fa-umbrella:before{content:"\\f39c"}.fa-undo:before{content:"\\f39d"}.fa-unlock:before{content:"\\f39e"}.fa-videocam:before{content:"\\f39f"}.fa-volume-high:before{content:"\\f123"}.fa-volume-low:before{content:"\\f131"}.fa-volume-mute:before{content:"\\f3a1"}.fa-volume-off:before{content:"\\f3a2"}.fa-walk:before{content:"\\f3a4"}.fa-wallet:before{content:"\\f18f"}.fa-warning:before{content:"\\f3a5"}.fa-watch:before{content:"\\f3a6"}.fa-water:before{content:"\\f3a7"}.fa-wifi:before{content:"\\f3a8"}.fa-wine:before{content:"\\f3a9"}.fa-woman:before{content:"\\f3aa"}div.tamper{color:#333;align-items:center;background-color:rgba(0,0,0,0.85);box-sizing:border-box;display:flex;font-size:14px !important;height:100%;justify-content:center;left:0;position:fixed;top:0;text-align:left;width:100%;z-index:900000}div.tamper>div{background-color:white;box-sizing:border-box;padding:1em;width:360px}div.tamper>div.doc{width:720px}div.tamper h1{font-size:1.8rem;font-weight:400;margin:10px 0 20px 0;text-align:center}div.tamper form{display:block}div.tamper form>div{padding:.5em 0}div.tamper form>div>div{margin:.5em 0}div.tamper form>div>div:last-child{margin-bottom:0}div.tamper form label:first-child{display:block;margin-bottom:.5em}div.tamper form label:first-child:before{content:"\\00bb";margin:0 .25em}div.tamper form label:not(:first-child){display:inline}div.tamper form input{box-shadow:none}div.tamper form input[type=text]{color:#000;background-color:#fff;border:1px solid #ddd;box-sizing:border-box;display:block;font-size:1em;padding:.5em;width:100%}div.tamper form input[type=text]:focus{border:1px solid #59c1f0}div.tamper form input[type=password]{color:#000;background-color:#fff;border:1px solid #ddd;box-sizing:border-box;display:block;font-size:1em;padding:.5em;width:100%}div.tamper form input[type=password]:focus{border:1px solid #59c1f0}div.tamper form input[type=radio],div.tamper form input[type=checkbox]{display:inline-block !important;height:1em;margin-right:.25em;vertical-align:middle;width:1em}div.tamper form input[type=checkbox]{-webkit-appearance:checkbox !important}div.tamper form input[type=radio]{-webkit-appearance:radio !important}div.tamper ul{margin:.5em;padding:0;list-style-type:disc;list-style-position:inside;max-height:520px;overflow-y:auto;scrollbar-width:thin}div.tamper ul>li{box-sizing:content-box;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:.25em 0;cursor:default}div.tamper ul>li.on{color:#f45a8d}div.summary{color:#666}div.btn-group{box-sizing:border-box;display:inline-flex}div.btn-group.full{display:flex}div.btn-group.outline>button{background-color:transparent;border:1px solid #ccc;color:#000}div.btn-group.outline>button:hover{color:#ffffff;background-color:#000;border-color:#000}div.btn-group.outline>button:not(:first-child){border-left:none}div.btn-group>button{background-color:#666;border-radius:0;border:none;color:#fff;display:inline-block;flex:1 1 auto;margin:0;outline:none;padding:.5em 1.25em;position:relative;font-size:inherit}div.btn-group>button:hover{background-color:#000}div.btn-group>button:first-child{border-bottom-left-radius:.25rem;border-top-left-radius:.25rem}div.btn-group>button:last-child{border-bottom-right-radius:.25rem;border-top-right-radius:.25rem}@keyframes spinner{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}.spinner{animation-name:spinner;animation-duration:1800ms;animation-timing-function:linear;animation-iteration-count:infinite}</tyle>');
        let e, t = location.host.split(".");
        while (t.length > 2) t.shift();
        switch (t.join(".")) {
            case "baidu.com":
                e = location.pathname.includes("/s/") ? '<style type="text/css">#bd-main>div.bd-aside{display:none !important}#bd-main>div.bd-left{margin:10px auto !important}#hd,#layoutHeader,#web-right-view,#layoutAside{display:none !important}#bd{width:960px;min-width:960px;margin:10px auto !important}#layoutApp>.frame-main{max-width:720px;margin-top:15px}#layoutApp>.frame-main>.frame-content{margin:0}div.frame-all{background-color:#444}div.x-button-box>a.g-button{display:none}div.x-button-box>a.g-button[data-button-id=b1]{display:inline-block}</style>' : '<style type="text/css">dd[node-type~=header-apps]{margin-right:120px !important}</style>';
                break;
            case "bilibili.com":
                e = '<style type="text/css">#videoList{display:flex;flex-wrap:wrap;list-style:none;margin-top:10px;width:100%}#videoList>li{border-radius:.25em;border:1px solid #ddd;cursor:default;display:inline-block;flex:initial initial auto;margin:4px 2px;padding:.5em 1.25em;text-align:center}#videoList>li:hover{background-color:#555;border-color:#555;color:#fff}</style>'
        }
        document.head.insertAdjacentHTML("beforeend", e)
    }

    function k() {
        if (document.querySelector("#zyset")) ipod.aria2 && u.zform("#zyset input", ipod.aria2), document.querySelector("#zyset").setAttribute("style", "display: flex");
        else {
            let e, t = location.host.split(".");
            while (t.length > 2) t.shift();
            switch (t.join(".")) {
                case "bilibili.com":
                    e = '<div class="tamper" id="zyset"> <div> <h1>Aria2\u4e0b\u8f7d\u52a9\u624b</h1> <form> <input name="version" type="hidden" value="20191120"> <div> <label>\u5e38\u89c4\u8bbe\u7f6e</label> <div> <input name="getlink" type="checkbox" value="1"> <label>\u4ec5\u63d0\u53d6\u89c6\u9891\u7684\u4e0b\u8f7d\u5730\u5740\uff0c\u7c98\u8d34\u5230idm\u4e2d\u4f7f\u7528</label><br> </div> <div> <input name="cover" type="checkbox" value="1"> <label>\u4e0b\u8f7d\u89c6\u9891\u6216\u63d0\u53d6\u94fe\u63a5\u5305\u542b\u5c01\u9762\u56fe\u7247</label> </div> <div> <input name="danmaku" type="checkbox" value="1"> <label>\u64ad\u653e\u89c6\u9891\u65f6\u9ed8\u8ba4\u5173\u95ed\u5f39\u5e55</label> </div> </div> <div> <label>\u8bbe\u7f6e aria2 jsonrpc</label> <input name="jsonrpc" type="text"> <div class="summary"> \u63a8\u8350\u4e0b\u8f7d\u4f7f\u7528\u5df2\u7ecf\u914d\u7f6e\u597d\u7684 <a href="https://pan.baidu.com/s/1-GFkG3l2XNwtiuO4Ffbsdw" target="_blank">Aria2 (Win64)</a> </div> </div> <div> <label>\u8bbe\u7f6e aria2 \u8bbf\u95ee\u53e3\u4ee4</label> <input name="token" type="password" placeholder="\u6ca1\u6709\u53e3\u4ee4\u5219\u4e0d\u8981\u586b\u5199\u4efb\u4f55\u5185\u5bb9"> </div> <div> <label>\u8bbe\u7f6e\u89c6\u9891\u4e0b\u8f7d\u4fdd\u5b58\u8def\u5f84</label> <input name="video" type="text"> <div class="summary"> \u8bf7\u4f7f\u7528\u5de6\u659c\u6760\u4f5c\u4e3a\u5206\u9694\u7b26\uff0c\u5141\u8bb8\u4e2d\u6587\u5b57\u7b26\u3002 </div> </div> <div> <label>\u8bbe\u7f6e\u756a\u5267\u4e0b\u8f7d\u4fdd\u5b58\u8def\u5f84</label> <input name="anime" type="text"> <div class="summary"> \u4e0b\u8f7d\u9650\u6e2f\u6fb3\u53f0\u7684\u756a\u5267\uff0c\u5927\u4f1a\u5458\u8d26\u53f7\u65e0\u6548\uff0c\u56e0\u4e3a\u8fdc\u7a0b\u670d\u52a1\u5668\u5e76\u6ca1\u4f7f\u7528\u5927\u4f1a\u5458\u8d26\u53f7\u8fdb\u884c\u89e3\u6790\uff0c\u4e5f\u5c31\u83b7\u53d6\u4e0d\u5230\u4ec5\u9650\u5927\u4f1a\u5458\u89c2\u770b\u7684\u90a3\u90e8\u5206\u3002 </div> </div> <div class="btn-group"> <button type="submit"> <i class="fa-checkmark"></i> \u786e\u5b9a </button> <button type="button"> <i class="fa-close"></i> \u53d6\u6d88 </button> </div> </form> </div> </div>';
                    break;
                default:
                    e = '<div class="tamper" id="zyset"> <div> <h1>Aria2\u4e0b\u8f7d\u52a9\u624b</h1> <form> <input name="version" type="hidden" value="20191120"> <div> <label>\u8bbe\u7f6e aria2 jsonrpc</label> <input name="jsonrpc" type="text"> <div class="summary"> \u63a8\u8350\u4e0b\u8f7d\u4f7f\u7528\u5df2\u7ecf\u914d\u7f6e\u597d\u7684 <a href="https://pan.baidu.com/s/1-GFkG3l2XNwtiuO4Ffbsdw" target="_blank">Aria2 (Win64)</a> </div> </div> <div> <label>\u8bbe\u7f6e aria2 \u8bbf\u95ee\u53e3\u4ee4</label> <input name="token" type="password" placeholder="\u6ca1\u6709\u53e3\u4ee4\u5219\u4e0d\u8981\u586b\u5199\u4efb\u4f55\u5185\u5bb9"> </div> <div> <label>\u8bbe\u7f6e\u4e0b\u8f7d\u4fdd\u5b58\u8def\u5f84</label> <input name="dir" type="text"> <div class="summary"> \u8bf7\u4f7f\u7528\u5de6\u659c\u6760\u4f5c\u4e3a\u5206\u9694\u7b26\uff0c\u8def\u5f84\u4e2d\u53ef\u4ee5\u6709\u4e2d\u6587 </div> </div> <div class="btn-group"> <button type="submit"><i class="fa-checkmark"></i> \u786e\u5b9a</button> <button type="button"><i class="fa-close"></i> \u53d6\u6d88</button> </div> </form> </div> </div>'
            }
            document.body.insertAdjacentHTML("beforeend", e), ipod.aria2 && u.zform("#zyset input", ipod.aria2);
            document.querySelector("#zyset button[type=button]").addEventListener("click", () => {
                u.zdom(), document.querySelector("#zyset").setAttribute("style", "display: none")
            }), document.querySelector("#zyset form").addEventListener("submit", () => {
                let e = {},
                    t = u.zdom(),
                    o = new FormData(t);
                for (let t of o.entries()) e[t[0]] = t[1];
                ipod.aria2 = Object.assign(ipod.defaults, e), u.save("aria2", ipod.aria2);
                document.querySelector("#zyset").setAttribute("style", "display: none")
            })
        }
    }
    let x;
    if (location.host.includes("bilibili.com")) {
        if (w(), ipod.uid = "20781212", ipod.header = ["Referer: " + location.href], ipod.header2 = {
                Referer: location.href
            }, ipod.defaults = {
                token: "",
                jsonrpc: "http://127.0.0.1:6800/jsonrpc",
                getlink: 0,
                cover: 0,
                danmaku: 0,
                video: "D:/bilibili/video",
                anime: "D:/bilibili/anime"
            }, ipod.vlist = u.load("vlist"), ipod.aria2 = u.load("aria2"), null != ipod.aria2 && "20191120" == ipod.aria2.version || (ipod.aria2 = Object.assign(ipod.defaults), "live.bilibili.com" == location.host || k()), "live.bilibili.com" == location.host && parseInt(location.pathname.substring(1))) {
            let e = document.querySelector("#sections-vm");
            e && e.remove(), (e = document.querySelector("#link-footer-vm")) && e.remove();
            (e = document.querySelector("#sidebar-vm")) && e.remove(), f();
            setInterval(() => {
                f()
            }, 3e5)
        }
        if ("www.bilibili.com" == location.host) {
            history.pushState = u.history("pushState"), window.addEventListener("pushState", f);
            location.pathname.startsWith("/video/") && (ipod.task = setInterval(() => {
                if ("function" == typeof jQuery && document.querySelector("div.ops") && "--" != document.querySelector("div.ops>span.coin").innerText.replace(/\s+/g, "") && (clearInterval(ipod.task), ipod.task = 0, f(), $("div.ops").first().prepend('<span id="zydl" title="\u4e0b\u8f7d"><i class="van-icon-download"></i>\u4e0b\u8f7d</span>'), $("#zydl").on("click", v), ipod.aria2.danmaku)) {
                    c(), history.pushState = u.history("pushState");
                    window.addEventListener("pushState", c)
                }
            }, 1e3)), location.pathname.startsWith("/bangumi/play/") && (ipod.task = setInterval(() => {
                if ("function" == typeof jQuery && document.querySelector("#toolbar_module") && "--" != document.querySelector("#toolbar_module>div.coin-info").innerText.replace(/\s+/g, ""))
                    if (clearInterval(ipod.task), ipod.task = 0, $("#toolbar_module").prepend('<div id="zydl" class="coin-info"><i class="fa-download"></i><span>\u4e0b\u8f7d</span></div>'), $("#zydl").on("click", v), __PGC_USERSTATE__.area_limit) {
                        let e = __INITIAL_STATE__;
                        ipod.aid = e.epInfo.aid, ipod.cid = e.epInfo.cid;
                        ipod.url = "https://www.biliplus.com/BPplayurl.php?aid=%1&cid=%2&qn=116&otype=json&module=bangumi", $.getScript("https://cdn.bootcss.com/flv.js/1.5.0/flv.min.js", () => {
                            document.querySelector("#bofqi").insertAdjacentHTML("beforeend", '<video id="bplayer" width="100%" height="100%" controls></video>'), $("#player_mask_module, div.limit_area_wrap").remove();
                            l()
                        });
                        let t = '<ul id="videoList">';
                        e.epList.forEach((e, o) => {
                            t += u.sprintf('<li data-aid="%1" data-cid="%2">%3</li>', e.aid, e.cid, g(o + 1))
                        }), t += "</ul>";
                        document.querySelector("#player_module").insertAdjacentHTML("afterend", t), $("#videoList > li").on("click", d)
                    } else if (ipod.aria2.danmaku) {
                    c(), f();
                    history.replaceState = u.history("replaceState"), window.addEventListener("replaceState", c)
                }
            }, 1e3))
        }
        if ("space.bilibili.com" == location.host) {
            history.pushState = u.history("pushState"), window.addEventListener("pushState", i);
            i()
        }
        if ("search.bilibili.com" == location.host) {
            history.pushState = u.history("pushState"), window.addEventListener("pushState", r);
            r()
        }
    }
    if (location.host.includes("baidu.com")) switch (ipod.header = ["User-Agent: Mozilla/5.0 (Linux; Android 4.4.2; Nexus 5 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36 baiduboxapp/6.8 (Baidu; P1 4.4.4)"], ipod.header2 = {
        "User-Agent": "Mozilla/5.0 (Linux; Android 4.4.2; Nexus 5 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36 baiduboxapp/6.8 (Baidu; P1 4.4.4)"
    }, ipod.defaults = {
        token: "",
        jsonrpc: "http://127.0.0.1:6801/jsonrpc",
        dir: "D:/netdisk"
    }, location.pathname) {
        case "/share/init":
            location.hash ? (document.querySelector("input").value = location.hash.substring(1, 5), document.querySelector("a.g-button-blue-large").click()) : GM_xmlhttpRequest({
                url: "https://search.pandown.cn/api/query?surl=1" + location.search.substring(6),
                method: "GET",
                onload(e) {
                    let t = JSON.parse(e.responseText);
                    0 == t.code && (document.querySelector("input").value = t.data[0].password, document.querySelector("a.g-button-blue-large").click())
                }
            });
            break;
        case "/disk/home":
            w(), ipod.aria2 = u.load("aria2");
            null != ipod.aria2 && "20191120" == ipod.aria2.version || (ipod.aria2 = Object.assign(ipod.defaults), k());
            let e = setInterval(() => {
                "function" == typeof jQuery && (clearInterval(e), location.hash.startsWith("#/all") && $("div.QDDOQB").removeClass("QDDOQB").addClass("btn-group outline").css("font-size", "12.5px").empty().append('<button name="zyset"><i class="fa-settings"></i> \u8bbe\u7f6e</button><button name="zydoc"><i class="fa-thumbs-up"></i> \u8bf4\u660e</button><button name="zydl"><i class="fa-download"></i> \u4e0b\u8f7d</button><button name="zyshare"><i class="fa-share"></i> \u514d\u5bc6\u5206\u4eab</button>').on("click", () => {
                    let e = u.zdom(1);
                    while (!e.hasAttribute("name")) e = e.parentElement;
                    switch (e.getAttribute("name")) {
                        case "zyset":
                            k();
                            break;
                        case "zydl":
                            e.children[0].setAttribute("class", "fa-refresh spinner"), (() => {
                                let e = 0,
                                    t = (() => {
                                        let e = [],
                                            t = a(n());
                                        return $("dd.g-clearfix").each((o, n) => {
                                            if (3 == n.getAttribute("class").replace(" open-enable", "").trim().split(" ").length) {
                                                let o = decodeURIComponent($(n).find("a").first().text());
                                                t.forEach(t => {
                                                    o == t.server_filename && (t.isdir ? e = e.concat(function e(t) {
                                                        let o, n = {
                                                            timestamp: yunData.timestamp,
                                                            uk: yunData.MYUK,
                                                            dir: t
                                                        };
                                                        return $.ajax({
                                                            async: !1,
                                                            method: "GET",
                                                            dataType: "json",
                                                            url: location.origin + "/api/list",
                                                            data: n,
                                                            success(t) {
                                                                (o = 0 == t.errno ? t.list : []).forEach(t => {
                                                                    t.isdir && (o = o.concat(e(t.path)))
                                                                })
                                                            }
                                                        }), o
                                                    }(t.path)) : e.push(t))
                                                })
                                            }
                                        }), t = [], e.forEach(e => {
                                            if (!e.isdir) {
                                                void 0 == e.thumbs || delete e.thumbs, e.url = [];
                                                t.push(e)
                                            }
                                        }), t
                                    })(),
                                    o = setInterval(() => {
                                        if (e == t.length) {
                                            clearInterval(o), u.aria2(t, ipod.aria2.jsonrpc);
                                            $("div.btn-group.outline > button[name=zydl] > i").attr("class", "fa-download")
                                        }
                                    }, 1e3);
                                t.forEach(t => {
                                    t.dir = ipod.aria2.dir, t.header = ipod.header;
                                    GM_xmlhttpRequest({
                                        method: "HEAD",
                                        url: "https://pcs.baidu.com/rest/2.0/pcs/file?app_id=778750&method=download&path=" + encodeURIComponent(t.path),
                                        headers: ipod.header2,
                                        onload(o) {
                                            if (e++, o.finalUrl)
                                                for (let e = 0; 16 > e; e++) t.url.push(o.finalUrl)
                                        }
                                    })
                                })
                            })();
                            break;
                        case "zyshare":
                            e.children[0].setAttribute("class", "fa-refresh spinner"), ((e = 0) => {
                                let t = [],
                                    o = {
                                        channel_list: [],
                                        path_list: [],
                                        period: e,
                                        schannel: 0
                                    };
                                (() => {
                                    let e = [],
                                        t = a(n());
                                    return $("dd.g-clearfix").each((o, n) => {
                                        if (3 == n.getAttribute("class").replace(" open-enable", "").trim().split(" ").length) {
                                            let o = decodeURIComponent($(n).find("a").first().text());
                                            t.forEach(t => {
                                                o == t.server_filename && e.push(t.path)
                                            })
                                        }
                                    }), e
                                })().forEach(e => {
                                    o.path_list.push(e)
                                });
                                for (let e in o) t.push(e + "=" + encodeURIComponent(JSON.stringify(o[e])));
                                $.ajax({
                                    url: "https://pan.baidu.com/share/pset",
                                    method: "POST",
                                    data: t.join("&"),
                                    success(e) {
                                        $("div.btn-group.outline > button[name=zyshare] > i").attr("class", "fa-share"), 0 == e.errno ? GM_setClipboard(e.link, "text") : alert("\u64cd\u4f5c\u5931\u8d25")
                                    }
                                })
                            })(0);
                            break;
                        default:
                            alert("\u8ba8\u538c\uff5e\u6233\u5230\u4eba\u5bb6\u5566")
                    }
                }))
            }, 1e3);
            break;
        default:
            let t = document.querySelector("#bd > div.bd-aside");
            t && t.setAttribute("style", "display: none"), w()
    }
    if (location.host.includes("wallhaven.cc")) {
        w(), ipod.defaults = {
            token: "",
            jsonrpc: "http://127.0.0.1:6800/jsonrpc",
            dir: "D:/picture",
            extype: ".jpg"
        };
        ipod.aria2 = u.load("aria2"), null != ipod.aria2 && "20191120" == ipod.aria2.version || (ipod.aria2 = Object.assign(ipod.defaults), k());
        let e = document.querySelector("#thumbs");
        e && e.addEventListener("click", () => {
            let e = u.zdom(1);
            fetch(e.getAttribute("href")).then(e => e.text()).then(e => {
                let t = e.match(/<img id="wallpaper" src="(.+?)"/);
                u.download(t[1])
            })
        })
    }
}();
