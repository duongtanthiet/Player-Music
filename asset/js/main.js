const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const PLAYER_STORAGE_KEY = 'music_player'
const player = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList =$ ('.playlist')
const app = {
    currentIndex: 0,
    isFlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs : [
        {
          name: "Không Thể Say",
          singer: "Hiếu Thứ Hai",
          path: "./asset/music/khongthesay.mp3",
          image: "./asset/img/khong-the-say.jpg",
        },
        {
            name: "Ngủ Một Mình",
            singer: "Hiếu Thứ Hai",
            path: "./asset/music/ngumotminh.mp3",
            image: "./asset/img/ngu-mot-minh.jpg",
          },
          {
            name: "Vệ Tinh",
            singer: "Hiếu Thứ Hai",
            path: "./asset/music/vetinh.mp3",
            image: "./asset/img/ve-tinh.jpg",
          },
          {
            name: "Nói Dối",
            singer: "Hiếu Thứ Hai",
            path: "./asset/music/noidoi.mp3",
            image: "./asset/img/noi-doi.jpg",
          },
          {
            name: "Bật Nhạc Lên",
            singer: "Hiếu Thứ Hai",
            path: "./asset/music/batnhaclen.mp3",
            image: "./asset/img/bat-nhac-len.jpg",
          },
          {
            name: "Cua",
            singer: "Hiếu Thứ Hai",
            path: "./asset/music/cua.mp3",
            image: "./asset/img/cua.jpg",
          },
          {
            name: "Chơi",
            singer: "Hiếu Thứ Hai",
            path: "./asset/music/choi.mp3",
            image: "./asset/img/choi.jpg",
          },
      ],
    setConfig: function(key , value){
         this.config[key] = value
         localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
      render: function() {
           const htmls = this.songs.map((song , index)  =>{
            return `
            <div class="song ${index === this.currentIndex ? 'active' : '' } " data-index = "${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
            <div class="body">
                 <h3 class="title">${song.name}</h3>
                 <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `
           })
           playList.innerHTML = htmls.join('')
      },
      defineProperties: function(){
           Object.defineProperty(this, 'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
           })
           
      },
      handleEvent: function(){
           const cdWidth = cd.offsetWidth
        //    xử lý xd quay và dừng
        const cdThumbAnimate =  cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ],{
            duration: 10000,
            iterations: Infinity    
        })
        cdThumbAnimate.pause()
        //    xử lý phóng to thu nhỏ cd
           document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop

            const newcdWidth = cdWidth - scrollTop
            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0
            cd.style.opacity = newcdWidth / cdWidth
           }
        //    xử lý khi click play  
        playBtn.onclick = function(){
            if(app.isFlaying){
                audio.pause()
            }else{
                audio.play()
            }
        }
        // khi song được play
        audio.onplay = function(){
            app.isFlaying = true    
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // khi song bị pause
        audio.onpause= function(){
            app.isFlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
                if(audio.duration){
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                    progress.value = progressPercent
                }
        }
        // xử lý khi tua song
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value  
            audio.currentTime = seekTime
        }
        // khi next song
        nextBtn.onclick = function() {
            if(app.isRandom){
                app.playRandomSong()
            }else {
                app.nextSong()
            }   
                audio.play()
                app.render()
                app.scrollToActiveSong()
         }
         // khi prev song
         prevBtn.onclick = function(){
            if(app.isRandom){
                app.playRandomSong()
            }else {
                app.prevSong()
            }
            audio.play()
            app.render()
        }
        // khi random song
        randomBtn.onclick = function(e){
            app.isRandom = ! app.isRandom
            app.setConfig('isRandom', app.isRandom)
            randomBtn.classList.toggle("active", app.isRandom)
          
        }
        // cử lý phát lại song
        repeatBtn.onclick = function(){
            app.isRepeat = ! app.isRepeat
            app.setConfig('isRepeat', app.isRepeat)
            repeatBtn.classList.toggle("active", app.isRepeat)
        }
        // xử lý next song khi audio ended
        audio.onended = function(){
           
            if(app.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }
        // lắng nghe click vào playlist
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)') 
            if(songNode || e.target.closest('.option')) { 
                // xử lý khi click vào song
                if(songNode ){
                     app.currentIndex = Number(songNode.dataset.index)
                     app.loadCurrentSong()
                     audio.play()
                     app.render()
                    
                }
                // xử lý khi click vào option
                
            }
        }
      },
      scrollToActiveSong: function(){
          setTimeout (function(){
            $('.song.active').scrollIntoView({
                behavior : 'smooth',
                block : 'nearest',
            })
          },200)
      },
      loadCurrentSong: function (){
           heading.textContent = this.currentSong.name
           cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
           audio.src = this.currentSong.path

      },
      loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRandom = this.config.isRepeat
      },
      nextSong: function () {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
      },
      prevSong: function () {
        this.currentIndex--
        if(this.currentIndex < 0 ){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
      },
      playRandomSong: function () {
        let newIndex
        do{
            newIndex= Math.floor(Math.random() * this.songs.length)
        }while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
      },
      start: function(){
        // gán cấu hình từ config vào ứng dụng
        this.loadConfig()
        // định nghĩa các thuộc tính cho oject
        this.defineProperties()
        // xử lý / lắng nghe các sự kiện (DOM event)
        this.handleEvent()
        // tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()
        // render lại playlist
        this.render()
        // hiển thị trạng thái ban đầu ucar btn repeat và random
        randomBtn.classList.toggle("active", app.isRandom)
        repeatBtn.classList.toggle("active", app.isRepeat)
      }
    }
    app.start()