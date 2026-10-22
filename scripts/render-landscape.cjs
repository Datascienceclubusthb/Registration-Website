// Regenerate with: npm install --prefix /tmp/dsc-art-tools three playwright
// node scripts/render-landscape.cjs /tmp/dsc-art-tools/node_modules
const fs=require('node:fs');const path=require('node:path');const http=require('node:http');
const root=path.resolve(__dirname,'..');const dependencies=process.argv[2];
if(!dependencies)throw Error('Pass the external node_modules path containing three and playwright.');
const {chromium}=require(path.join(path.resolve(dependencies),'playwright'));
const sharp=require(path.join(root,'node_modules/sharp'));
(async()=>{
 const server=http.createServer((req,res)=>{
   let file,type;
   if(req.url==='/'){res.setHeader('Content-Type','text/html');res.end('<body style="margin:0"><script type="module" src="/scene.js"></script>');return}
   if(req.url==='/scene.js'){file=path.join(__dirname,'landscape-scene.js');type='text/javascript'}
   else if(req.url==='/logo.svg'){file=path.join(root,'public/dsc-logo.svg');type='image/svg+xml'}
   else if(/^\/three\/[\w.-]+\.js$/.test(req.url)){file=path.join(path.resolve(dependencies),'three/build',path.basename(req.url));type='text/javascript'}
   else {res.writeHead(404);res.end();return}
   res.setHeader('Content-Type',type);res.end(fs.readFileSync(file));
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;
 try{
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader'],headless:true});
  const page=await browser.newPage({viewport:{width:2200,height:1300}});page.on('pageerror',e=>console.error(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);await page.waitForFunction(()=>window.renderReady===true,{},{timeout:120000});
  const png=await page.locator('canvas').screenshot({timeout:120000});
  await sharp(png).webp({quality:88}).toFile(path.join(root,'public/dsc-landscape.webp'));
  console.log('Rendered public/dsc-landscape.webp');
 }finally{if(browser)await browser.close();server.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
