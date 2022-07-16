class NoAPI{constructor(a,b,c){this.data=a,this.checkData(),this.fetchCoins().then(a=>{this.data.coins=a,this.storeData()}).catch(a=>{console.log(a)}),this.platform=b,this.storage=c}checkData(){this.empty(this.data.activity)&&(this.data.activity={}),this.empty(this.data.coins)&&(this.data.coins={}),this.empty(this.data.historical)&&(this.data.historical={}),this.empty(this.data.holdings)&&(this.data.holdings={}),this.empty(this.data.settings)&&(this.data.settings={shareHoldings:"disabled",pin:"0000",css:"",refetchTime:86400}),this.empty(this.data.watchlist)&&(this.data.watchlist={}),this.storeData()}async storeData(){let a=JSON.stringify(this.data);switch(this.platform){case"website":this.storage.setItem("NoAPI",a);break;case"desktop":case"mobile":await this.storage.setItem("NoAPI",a)}}getData(){return this.data}setData(a){return!!(!("modified"in this.data)||this.validGracePeriod(parseInt(this.data.modified)))&&(a.modified=Math.floor(new Date().getTime()/1e3),this.data=a,this.storeData(),!0)}createActivity(l,m,c,a,n,d,e,f,g,h,i,j){if(!this.empty(l)&&!this.empty(m)&&!this.empty(c)&&!this.empty(a)&&!this.empty(n)){if(this.empty(d)&&(d=0),this.empty(e)&&(e="-"),!this.validDate(c))return{error:"Invalid date."};{let p=Math.floor(new Date(Date.parse(c)).getTime()/1e3),b={id:l,symbol:m,date:c,time:p,type:a,amount:n,fee:d,notes:e};if("buy"!==a&&"sell"!==a&&"transfer"!==a)return{error:"Invalid activity type."};"buy"===a||"sell"===a?(this.empty(f)&&(f="-"),this.empty(g)&&(g="-"),this.empty(h)&&(h=0),b.exchange=f,b.pair=g,b.price=h):"transfer"===a&&(this.empty(i)&&(i="-"),this.empty(j)&&(j="-"),b.from=i,b.to=j);let k=Math.floor(new Date().getTime()/1e3)+this.getRandomHex(8);for(;(k in this.data.activity);)k=Math.floor(new Date().getTime()/1e3)+this.getRandomHex(8);let o=this.data;return o.activity[k]=b,this.setData(o)?{message:"The activity has been recorded."}:{error:"Activity couldn't be recorded."}}}}deleteActivity(a){if(!this.empty(a)){let b=this.data;return delete b.activity[a],this.setData(b)?{message:"The activity has been deleted."}:{error:"Activity couldn't be deleted."}}}exportActivity(){let a="txID,id,symbol,date,type,amount,fee,notes,exchange,pair,price,from,to\r\n";return Object.keys(this.data.activity).map(c=>{let b=this.data.activity[c];a+=[c,b.id,b.symbol,b.date,b.type,b.amount,b.fee,b.notes,b.exchange,b.pair,b.price,b.from,b.to,].join(",")+"\r\n"}),a}importActivity(a){let b=!0,c=this.data;return(a.map(h=>{let a=h.split(","),f=this.empty(a[0])?b=!1:a[0];if("-"===f)for(f=Math.floor(new Date().getTime()/1e3)+this.getRandomHex(8);(f in this.data.activity);)f=Math.floor(new Date().getTime()/1e3)+this.getRandomHex(8);let i=this.empty(a[1])?b=!1:a[1],j=this.empty(a[2])?b=!1:a[2],g=this.empty(a[3])?b=!1:this.replaceAll(this.replaceAll(a[3],"'",""),'"',""),d=this.empty(a[4])?b=!1:a[4].toLowerCase(),k=this.empty(a[5])?b=!1:a[5],l=this.empty(a[6])?0:a[6],m=this.empty(a[7])?"-":this.replaceAll(a[7],'"',"");if(!this.validDate(g))return b=!1,{error:"Invalid date."};{let n=Math.floor(new Date(Date.parse(g)).getTime()/1e3),e={id:i,symbol:j,date:g,time:n,type:d,amount:k,fee:l,notes:m};if("buy"!==d&&"sell"!==d&&"transfer"!==d)return b=!1,{error:"Invalid activity type."};if("buy"===d||"sell"===d){let o=this.empty(a[8])?"-":this.replaceAll(a[8],'"',""),p=this.empty(a[9])?"-":this.replaceAll(a[9],'"',""),q=this.empty(a[10])?0:a[10];e.exchange=o,e.pair=p,e.price=q}else if("transfer"===d){let r=this.empty(a[11])?"-":this.replaceAll(a[11],'"',""),s=this.empty(a[12])?"-":this.replaceAll(a[12],'"',"");e.from=r,e.to=s}c.activity[f]=e}}),b)?this.setData(c)?{message:"The activities have been recorded."}:{error:"Activities couldn't be recorded."}:{error:"Invalid content format."}}readActivity(){return this.data.activity}updateActivity(l,m,n,c,a,o,d,e,f,g,h,i,j){if(!this.empty(m)&&!this.empty(n)&&!this.empty(c)&&!this.empty(a)&&!this.empty(o)){if(this.empty(d)&&(d=0),this.empty(e)&&(e="-"),!this.validDate(c))return{error:"Invalid date."};{let p=Math.floor(new Date(Date.parse(c)).getTime()/1e3),b={id:m,symbol:n,date:c,time:p,type:a,amount:o,fee:d,notes:e};if("buy"!==a&&"sell"!==a&&"transfer"!==a)return{error:"Invalid activity type."};"buy"===a||"sell"===a?(this.empty(f)&&(f="-"),this.empty(g)&&(g="-"),this.empty(h)&&(h=0),b.exchange=f,b.pair=g,b.price=h):"transfer"===a&&(this.empty(i)&&(i="-"),this.empty(j)&&(j="-"),b.from=i,b.to=j);let k=this.data;return l in k.activity?(k.activity[l]=b,this.setData(k)?{message:"The activity has been updated."}:{error:"Activity couldn't be updated."}):{error:"Activity not found."}}}}readCoins(a){return new Promise((b,c)=>{this.fetchCoins().then(d=>{let c;!(this.empty(a.id)&&this.empty(a.symbol))&&(this.empty(a.id)||this.empty(a.symbol))&&(this.empty(a.symbol)?this.empty(a.id)||(c=this.findByID(d,a.id,!0)):c=this.findBySymbol(d,a.symbol,!0),this.storeData(),b(c))}).catch(a=>{console.log(a),c(a)})})}fetchCoins(){return new Promise((a,b)=>{if(this.empty(this.data.coins)||Math.floor(new Date().getTime()/1e3)-3600>parseInt(this.data.fetchedCoins)){console.log("Fetching Coins...");let c=[];fetch("https://api.coingecko.com/api/v3/coins/list",{method:"GET",headers:{Accept:"application/json","Content-Type":"application/json"}}).then(a=>a.json()).then(b=>{Object.keys(b).map(a=>{let d={[b[a].symbol.toLowerCase()]:b[a].id};c.push(d)}),this.data.fetchedCoins=Math.floor(new Date().getTime()/1e3),a(c)}).catch(a=>{console.log(a),b(a)})}else a(this.data.coins)})}findBySymbol(c,b,d){let a=[];return(c.map(c=>{Object.keys(c)[0]===b&&a.push(c)}),1===a.length)?{id:a[0][b],symbol:b}:this.empty(a)?d?this.findByID(c,b,!1):{error:"No coins were found with that symbol."}:{matches:a}}findByID(b,a,c){let d=Object.values(b),e={},f=[];return(d.map(a=>{f.push(a[Object.keys(a)[0]]),e[a[Object.keys(a)[0]]]=Object.keys(a)[0]}),f.includes(a))?{id:a,symbol:e[a]}:c?this.findBySymbol(b,a,!1):{error:"No coins were found with that symbol."}}deleteHistorical(){return"historical"in this.data?(this.data.historical={},this.storeData(),{message:"Berhasil Hapus."}):{message:"Data kosong."}}readHistorical(a,b,c,d,e){if(!this.empty(a)&&!this.empty(b)&&!this.empty(c)&&!this.empty(d))return new Promise((g,h)=>{a=a.split(",");let i={};for(let f=0;f<a.length;f++)setTimeout(()=>{this.fetchHistoricalData(a[f],b,c,d).then(b=>{i[a[f]]=b,f===a.length-1&&j()}).catch(b=>{f===a.length-1&&j(),console.log(b)})},2e3*f);function j(){"true"===e?g({message:"Fetched historical data."}):g(i)}})}fetchHistoricalData(a,b,c,d){let e=a+b;return new Promise((f,g)=>{this.historicalDataExists(a,b)?f(this.data.historical[e]):(console.log("Fetching Historical Data..."),fetch("https://api.coingecko.com/api/v3/coins/"+a+"/market_chart/range?vs_currency="+b+"&from="+c+"&to="+d,{method:"GET",headers:{Accept:"application/json","Content-Type":"application/json"}}).then(a=>a.json()).then(a=>{this.data.historical[e]=a,this.data.historical["modified"+e]=Math.floor(new Date().getTime()/1e3),this.storeData(),f(a)}).catch(a=>{console.log(a),g(a)}))})}historicalDataExists(d,e){let a=d+e,b=this.data.settings,c=86400;return this.empty(b.refetchTime)||(c=parseInt(b.refetchTime)),!(!(a in this.data.historical)||Math.floor(new Date().getTime()/1e3)-c>parseInt(this.data.historical["modified"+a]))}createHoldings(a,d,c){if(!this.empty(a)&&!this.empty(d)&&!this.empty(c)){let b=this.data;return Object.keys(b.holdings).includes(a)?b.holdings[a].amount+=c:b.holdings[a]={symbol:d,amount:c},this.setData(b)?{message:"The asset has been created."}:{error:"Asset couldn't be created."}}}deleteHoldings(a){if(!this.empty(a)){let b=this.data;return delete b.holdings[a],this.setData(b)?{message:"The asset has been deleted."}:{error:"Asset couldn't be deleted."}}}exportHoldings(){let a="id,symbol,amount\r\n";return Object.keys(this.data.holdings).map(b=>{let c=this.data.holdings[b];a+=[b,c.symbol,c.amount].join(",")+"\r\n"}),a}importHoldings(a){let b=!0,c=this.data;return(a.map(f=>{let a=f.split(","),d=this.empty(a[0])?b=!1:a[0],g=this.empty(a[1])?b=!1:a[1],e=this.empty(a[2])?b=!1:a[2];Object.keys(c.holdings).includes(d)?c.holdings[d].amount+=e:c.holdings[d]={symbol:g,amount:e}}),b)?this.setData(c)?{message:"The assets have been created."}:{error:"Assets couldn't be created."}:{error:"Invalid content format."}}readHoldings(){return this.data.holdings}updateHoldings(a,c){if(!this.empty(a)&&!this.empty(c)){let b=this.data;return Object.keys(b.holdings).includes(a)?(b.holdings[a].amount=c,this.setData(b))?{message:"The asset has been updated."}:{error:"Asset couldn't be updated."}:{error:"Asset not found."}}}readSettings(){return this.data.settings}updateSettings(a,c){if(!this.empty(a)&& void 0!==c){let b=this.data;return Object.keys(b.settings).includes(a)?(b.settings[a]=c,this.setData(b))?{message:"The setting has been updated."}:{error:"Setting couldn't be updated."}:{error:"Setting not found."}}}createWatchlist(a,b){if(!this.empty(a)&&!this.empty(b)){let c=this.data;return c.watchlist[a]={symbol:b},this.setData(c)?{message:"Portofolio ditambahkan ke favorit."}:{error:"Gagal."}}}deleteWatchlist(a){if(!this.empty(a)){let b=this.data;return delete b.watchlist[a],this.setData(b)?{message:"Portofolio removed from watchlist."}:{error:"Asset couldn't be removed from watchlist."}}}readWatchlist(){return this.data.watchlist}validGracePeriod(a){return Math.floor(new Date().getTime()/1e3)-1>a}getRandomHex(a){return[...Array(2*a)].map(()=>Math.floor(16*Math.random()).toString(16)).join("")}validDate(a){return Date.parse(a),!isNaN(new Date(Date.parse(a)))}replaceAll(b,c,a,d){return b.replace(new RegExp(c.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),d?"gi":"g"),"string"==typeof a?a.replace(/\$/g,"$$$$"):a)}empty(a){return"object"==typeof a&&null!==a&&0===Object.keys(a).length||null==a||""===a.toString().trim()}}