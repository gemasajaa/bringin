const puppet = require('puppeteer');
const fs = require('fs');
//https://162.212.152.160/
//https://162.212.152.160/category/action/
const dog = {
  url:'',
  async start(){
    this.browser = await puppet.launch({headless:false});
    this.page = await this.browser.newPage();
	//set the timeout to Infinity.
    await this.page.setDefaultNavigationTimeout(0);
  },
  async getContent(url){
    await this.start();
    await this.page.goto(url);
	//this is the section of scrapping method.
	//editable code is here.
    const contents = await this.page.$$("article div.gmr-box-content");
    const valuatecontent = [];
    for(let content of contents){
      valuatecontent.push({
        link:await content.$eval('div.item-article header a',el=>`${el.href}`),
        title:await content.$eval('div.item-article header a',el=>el.innerText),
        thumbnail:await content.$eval('div.content-thumbnail a img',el=>el.src),
        rating:await content.$eval('div.content-thumbnail div.gmr-rating-item',el=>el.innerText),
		duration:await content.$eval('div.content-thumbnail div.gmr-duration-item',el=>el.innerText),
      });
    }
    await this.browser.close();
	console.log(valuatecontent);
	fs.writeFile(`./more/base/movies${category}.list`,JSON.stringify(valuatecontent),(err)=>{
		if(err)throw err;
		console.log('getting movies data successfull.');
	})
    //return valuatecontent;
  },
  async getVideoSrc(url,servertwo=false){
	console.log('processing ',url);
    await this.start();
    await this.page.goto((servertwo)?url+'?player=2':url);
    const content = await this.page.$('div.gmr-embed-responsive');
	if(!content){
		console.log('no content, trying in diffrent Way');
		this.browser.close();
		this.getVideoSrc(url,!servertwo);
	}else{
		movieList[i].linkEmbeded = await content.$eval('iframe',el=>el.src);
		if(i<=movieList.length-1){
			this.browser.close();
			console.log('justFinished ',url,' '+i);
			console.log(movieList,i);
			i++;
			this.getVideoSrc(movieList[i].link,servertwo);
		}else{
			console.log(movieList);
			this.browser.close();
		}
	}    
  }
}
//finish one Thriller
//const category = 'tokusatsu';
//dog.getContent(`https://162.212.152.160/category/comedy/${category}`);
let i = 0;
const movieList = [
  {
    link: 'https://162.212.152.160/tv/sherlock-season-subtitle-indonesia/',
    title: 'Sherlock Season 1 2 3 dan 4',
    thumbnail: 'https://162.212.152.160/wp-content/uploads/2020/07/aguWVR8xNilvw7t4X03UvG1hRJr-152x228.jpg',
    rating: ' 8.4',
    duration: ' 90 min',
    linkEmbeded: 'https://files.im/embed-l81g1qw5czxv.html'
  },
  {
    link: 'https://162.212.152.160/tv/titans-season-subtitle-indonesia/',
    title: 'Titans Season 1 dan 2',
    thumbnail: 'https://162.212.152.160/wp-content/uploads/2020/07/eeHI5iBSCOxj4HGSOmFM6azBmwb-152x228.jpg',
    rating: ' 7.9',
    duration: ' 43 min',
    linkEmbeded: 'https://www.youtube.com/embed/pkfnDDfznZI'
  },
  {
    link: 'https://162.212.152.160/tv/band-of-brothers-2001-subtitle-indonesia/',
    title: 'Band of Brothers (2001)',
    thumbnail: 'https://162.212.152.160/wp-content/uploads/2019/09/yRXTVpDRBA3983C3HjoY0SO4dV6-152x228.jpg',
    rating: ' 8.2',
    duration: ' 60 min',
    linkEmbeded: 'https://www.youtube.com/embed/1wlYPlwjGOY'
  }
]
//dog.getVideoSrc(movieList[i].link,false);
console.log(JSON.stringify(movieList));
