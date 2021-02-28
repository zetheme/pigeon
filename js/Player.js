
"use strict";

function _classCallCheck(a, b) {
	if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
}
var _createClass = function () {
	function a(a, b) {
		for (var c = 0; c < b.length; c++) {
			var d = b[c];
			d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d)
		}
	}
	return function (b, c, d) {
		return c && a(b.prototype, c), d && a(b, d), b
	}
}(),
	Util = {
		leftDistance: function (a) {
			for (var b = a.offsetLeft, c = void 0; a.offsetParent;) a = a.offsetParent, b += a.offsetLeft;
			return c = document.body.scrollLeft + document.documentElement.scrollLeft, b - c
		},
		timeFormat: function (a) {
			var b = parseInt(a / 60),
				c = parseInt(a % 60);
			return (b < 10 ? "0" + b : b) + ":" + (c < 10 ? "0" + c : c)
		},
		percentFormat: function (a) {
			return (100 * a).toFixed(2) + "%"
		},
		ajax: function (a) {
			a.beforeSend && a.beforeSend();
			var b = new XMLHttpRequest;
			b.onreadystatechange = function () {
				4 === b.readyState && (b.status >= 200 && b.status < 300 ? a.success && a.success(b.responseText) : a.fail && a.fail(b.status))
			}, b.open("GET", a.url), b.send(null)
		}
	},
	instance = !1,
	baseUrl = Config.themeUrl + '/libs/music.php',
	CTPlayer = function () {
		function a(b) {
			var c = this;
			if (_classCallCheck(this, a), instance) return console.error("只能存在一个实例！"), Object.create(null);
			instance = !0;
			this.isMobile = /mobile/i.test(window.navigator.userAgent);
			if (this.isMobile) {
				var d = {
					element: document.getElementById("CTPlayer"),
					autoplay: !1,
					mode: "listloop",
					listshow: !0
				};
			} else {
				var d = {

					element: document.getElementById("CTPlayer"),
					autoplay: !1,
					mode: "listloop",
					listshow: !0
				};
			}
			for (var e in d) b.hasOwnProperty(e) || (b[e] = d[e]);
			if (this.option = b, !(this.option.music && this.option.music.type && this.option.music.source)) return console.error("请正确配置对象！"), Object.create(null);
			this.root = this.option.element,
				this.type = this.option.music.type,
				this.music = this.option.music.source,
				this.media = this.option.music.media,
				this.isReady = !1,
				this.toggle = this.toggle.bind(this),
				this.toggleList = this.toggleList.bind(this),
				this.toggleMute = this.toggleMute.bind(this),
				this.switchMode = this.switchMode.bind(this);
				"file" === this.type ? (this.root.innerHTML = this.template(), this.init(), this.bind(), this.isReady = !0) : "cloud" === this.type && (this.root.innerHTML = '<p class="CTPlayer-tip-loading relative"><span></span> <span></span> <span></span> <span></span><span></span></p>', Util.ajax({
				url: baseUrl + "?type=collect&media=" + this.media + "&id=" + this.music,
				beforeSend: function () { },
				success: function (a) {
					c.music = JSON.parse(a), c.root.innerHTML = c.template(), c.init(), c.bind()
				},
				fail: function (a) {
					console.error("歌单拉取失败！ 错误码：" + a)
				}
			}))
		}
		return _createClass(a, [{
			key: "notice",
			value: function (a, b) {
				$.message({
					title: LocalConst.MUSIC_NOTICE,
					message: a,
					type: b
				})
			}
		}, {
			key: "template",
			value: function () {
				var a = `
                
        <div id="mp-music" data-autoplay="no" data-autoplaynext="yes" style="">
        <div id="mp-music-wrapper">
            <div id="mp-list">
				<ul class="CTPlayer-list absolute"  >`;
				for (var b in this.music) {
					a += `
					<li class="h6 relative px1 overflow-hidden" data-index="${b}"><i class="absolute left-0 CTPlayer-list-sign"></i><span class="absolute top-0 CTPlayer-list-index">${(parseInt(b) + 1)}</span><span class="CTPlayer-list-name" title="${this.music[b].name}">${this.music[b].name}</span><span class="right overflow-hidden CTPlayer-list-author" title="${this.music[b].author} ">${this.music[b].author}</span></li>`;
				}
				a += `
                </ul>
                </div>
                <div id="mp-ctrl-group">
                <audio class="CTPlayer-source" src="${("file" === this.type ? this.music[0].src : "")}" preload="auto"></audio>
                    <button id="mp-music-album" class=" mp-mdl-button  mp-mdl-button--icon"><img class="CTPlayer-cover circle mr1" src="${this.music[0].cover}" alt="" /></button>
                    <p class="CTPlayer-name h6 ml1">${this.music[0].name}</p>
                    <div id="mp-hide-panel">
                        <div id="mp-ctrl-panel">
                            <button id="mp-music-volume" class=" mp-mdl-button mp-mdl-button--icon"><i class="material-icons">volume_up</i></button>
                            <button id="mp-music-list" class=" mp-mdl-button mp-mdl-button--icon"><i class="material-icons">playlist_play</i></button>
                            <button onclick="player.prev();" id="mp-music-prev" class="lastMusic mp-mdl-button mp-mdl-button--icon"><i class="material-icons">skip_previous</i></button>
                            <button id="mp-music-play" class="btncon mp-mdl-button mp-mdl-button--icon"><i id="musicbtn" class="material-icons">play_circle_filled</i><i style="display:none" id="musicstopbtn" class="material-icons">pause_circle_filled</i></button>
                            <button onclick="player.next();" id="mp-music-next" class="nextMusic mp-mdl-button mp-mdl-button--icon"><i class="material-icons">skip_next</i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
                `;
				return a;
			}
		}, {
			key: "init",
			value: function () {
				var a = this;
                if ($("#mp-music").length === 0) {
                    return
                }
                $("#mp-music-list").on("click", function(A) {
                    if ($("#mp-list").css("display") !== "none") {
                        $("#mp-list").animate({
                            width: "0px"
                        }, 200, function() {
                            $("#mp-list").hide()
                        });
                        
                    } else {
                        $("#mp-list").show().animate({
                            width: "250px"
                        }, 200);
                       
                    }
                });
                $("#mp-music-album").on("click", function(A) {
                    if ($("#mp-music-wrapper").hasClass("open")) {
                        mmmm()
                    } else {
                        qqqq()
                    }
                    $(document).one("click", function() {
                        mmmm()
                    });
                    $("#mp-music-wrapper").on("click", function(B) {
                        B.stopPropagation()
                    })
                });
                var qqqq = function() {
                    $("#mp-music-wrapper").addClass("mp-mdl-shadow--2dp open");
                    $("#mp-hide-panel").slideDown(200, function() {
                            if (!true) {
                                $("#mp-list").show().animate({
                                    width: "250px"
                                }, 200)
                            }
                        })
                    };
                    var mmmm = function() {
                        if ($("#mp-list").css("display") !== "none") {
                            $("#mp-list").animate({
                                width: "0px"
                            }, 200, function() {
                                $("#mp-list").hide();
                                xxxx()
                            })
                        } else {
                            xxxx()
                        }
                    };
                    var xxxx = function() {
                        $("#mp-hide-panel").slideUp(200, function() {
                            $("#mp-music-wrapper").removeClass("mp-mdl-shadow--2dp open")
                            })
                        };
				if (this.dom = {
					cover: this.root.querySelector(".CTPlayer-cover"),
					playbutton: this.root.querySelector(".btncon"),
					name: this.root.querySelector(".CTPlayer-name"),
					author: this.root.querySelector(".CTPlayer-author"),

					musiclist: this.root.querySelector(".CTPlayer-list"),
					musicitem: this.root.querySelectorAll(".CTPlayer-list li")
				}, this.audio = this.root.querySelector(".CTPlayer-source"), this.option.listshow && (this.root.className = "CTPlayer-list-on"), "singleloop" === this.option.mode && (this.audio.loop = !0), this.dom.musicitem[0].className = "h6 relative px1 overflow-hidden CTPlayer-curMusic", "file" === this.type) {
					if (this.option.autoplay && !this.isMobile) {
						var b = !0;
						iziToast.warning({
							title: '音乐播放',
							message: '即将自动播放,关闭本通知停止播放',
							position: 'topRight',
							pauseOnHover: false,
							onClosing: function () { b = !1 },
						}), setTimeout(function () {
							b && a.play()
						}, 5050);
					}

				}
				$(".CTPlayer-list-switch").click(function () {
					player.toggleList()
				});
				"cloud" === this.type && Util.ajax({
					url: baseUrl + "?type=song&media=" + this.media + "&id=" + this.music[0].song_id,
					beforeSend: function () { },
					success: function (b) {
						var c = JSON.parse(b).url;
						if (null !== c) a.isReady = !0, a.audio.src = c;
						else {
							var d = parseInt(a.dom.musiclist.querySelector(".CTPlayer-curMusic").getAttribute("data-index"));
							a.errorHandle(d)
						}
						if (a.option.autoplay && !a.isMobile) {
							var e = !0;
							iziToast.warning({
								title: '音乐播放',
								message: '即将自动播放,关闭本通知停止播放',
								position: 'topRight',
								pauseOnHover: false,
								onClosing: function () { e = !1 },
							}), setTimeout(function () {
								e && a.play()
							}, 5050);
						}
					},
					fail: function (a) {
						console.error("歌曲拉取失败！ 错误码：" + a)
					}
				})
			}
		}, {
			key: "bind",
			value: function () {
				var a = this;
				this.audio.addEventListener("canplay", function (a) { }), this.audio.addEventListener("error", function (b) {
					if (a.isReady) {
						var c = parseInt(a.dom.musiclist.querySelector(".CTPlayer-curMusic").getAttribute("data-index"));
						a.errorHandle(c)
					}
				}), this.audio.addEventListener("seeked", function (b) {
					a.play()
				}), this.audio.addEventListener("ended", function (b) {
					a.next()
				}), this.dom.playbutton.addEventListener("click", this.toggle), this.isMobile, this.dom.musiclist.addEventListener("click", function (b) {
					var c = void 0,
						d = void 0,
						e = void 0;
					if ("LI" === b.target.tagName.toUpperCase()) c = b.target;
					else {
						if ("LI" !== b.target.parentElement.tagName.toUpperCase()) return;
						c = b.target.parentElement
					}
					d = parseInt(c.getAttribute("data-index")), e = parseInt(a.dom.musiclist.querySelector(".CTPlayer-curMusic").getAttribute("data-index")), d === e ? a.play() : a.switchMusic(d + 1)
				})
			}
		}, {
			key: "prev",
			value: function () {
				var a = parseInt(this.dom.musiclist.querySelector(".CTPlayer-curMusic").getAttribute("data-index"));
				0 === a ? 1 === this.music.length ? this.play() : this.switchMusic(this.music.length - 1 + 1) : this.switchMusic(a - 1 + 1)
			}
		}, {
			key: "next",
			value: function () {
				var a = parseInt(this.dom.musiclist.querySelector(".CTPlayer-curMusic").getAttribute("data-index"));
				a === this.music.length - 1 ? 1 === this.music.length ? this.play() : this.switchMusic(1) : this.switchMusic(a + 1 + 1)
			}
		}, {
			key: "errorHandle",
			value: function (a) {
				this.dom.musicitem[a].classList.add("invalid-name"), $.message({
					title: LocalConst.MUSIC_NOTICE,
					message: LocalConst.MUSIC_FAILE_END,
					type: "error"
				})
			}
		}, {
			key: "sleep",
			value: function (a) {
				for (var b = Date.now(); Date.now - b <= a;);
			}
		}, {
			key: "switchMusic",
			value: function (a) {
				var b = this;
				return "number" != typeof a ? void console.error("请输入正确的歌曲序号！") : (a -= 1) < 0 || a >= this.music.length ? void console.error("请输入正确的歌曲序号！") : a == this.dom.musiclist.querySelector(".CTPlayer-curMusic").getAttribute("data-index") ? void this.play() : (this.dom.musiclist.querySelector(".CTPlayer-curMusic").classList.remove("CTPlayer-curMusic"), this.dom.musicitem[a].classList.add("CTPlayer-curMusic"), this.dom.name.innerHTML = this.music[a].name, this.dom.cover.src = this.music[a].cover, void ("file" === this.type ? void 0 !== this.music[a].src ? (this.audio.src = this.music[a].src, this.isReady = !0, this.play()) : this.errorHandle(a) : "cloud" === this.type && Util.ajax({
					url: baseUrl + "?type=song&media=" + this.media + "&id=" + this.music[a].song_id,
					beforeSend: function () { },
					success: function (a) {
						var c = JSON.parse(a).url;
						null !== c ? (b.audio.src = c, b.isReady = !0, b.play()) : 1 !== b.music.length && b.next()
					},
					fail: function (a) {
						console.error("歌曲拉取失败！ 错误码：" + a)
					}
				})))
			}
		}, {
			key: "play",
			value: function () {
				this.audio.paused && (this.audio.play(), this.dom.cover.classList.add("CTPlayer-pause"))
				$("#musicbtn").css("display", "none");
				$("#musicstopbtn").css("display", "inline-block");
				$(".fa-music-alt").addClass("fa-spin")
			}
		}, {
			key: "pause",
			value: function () {
				this.audio.paused || (this.audio.pause(), this.dom.cover.classList.remove("CTPlayer-pause"))
				$("#musicbtn").css("display", "inline-block");
				$("#musicstopbtn").css("display", "none");
				$(".fa-music-alt").removeClass("fa-spin")
			}
		}, {
			key: "toggle",
			value: function () {
				this.audio.paused ? this.play() : this.pause()
			}
		}, {
			key: "toggleList",
			value: function () {
				this.root.classList.contains("CTPlayer-list-on") ? this.root.classList.remove("CTPlayer-list-on") : this.root.classList.add("CTPlayer-list-on")
			}
		}, {
			key: "toggleMute",
			value: function () {
				this.audio.muted ? (this.audio.muted = !1, this.dom.volumebutton.className = "CTPlayer-icon glyphicon glyphicon-volume-up", this.dom.volumeline_value.style.width = Util.percentFormat(this.audio.volume)) : (this.audio.muted = !0, this.dom.volumebutton.className = "CTPlayer-icon glyphicon glyphicon-volume-off", this.dom.volumeline_value.style.width = "0%")
			}
		}, {
			key: "switchMode",
			value: function () {
				this.audio.loop ? (this.audio.loop = !1, this.dom.modebutton.classList.remove("CTPlayer-mode-loop")) : (this.audio.loop = !0, this.dom.modebutton.classList.add("CTPlayer-mode-loop"))
			}
		}, {
			key: "destroy",
			value: function () {
				instance = !1, this.audio.pause(), this.root.innerHTML = "";
				for (var a in this) delete this[a]
			}
		}]), a
	}();

    var player = new CTPlayer({
        autoplay: false,
        listshow: false,
        mode: 'listloop',
        music: {
            type: 'cloud',
            source: Config.musicId,
            media: Config.musicMedia,
        }
    });