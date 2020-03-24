## 功能
它用来检查你的markdown文件对应的图片文件夹下是否有多余的图片。
例如：
```
|-yourmarkdown.md // 只引用了asset/1.png
|-asset
|-asset/1.png
|-asset/2.png
|-asset/3.png
```
在如上文件结构中，yourmarkdown.md只引用了1.png图片，而2.png,3.png没有用到。此时你可以使用`md-img-shaking`来把2.png,3.png 从asset目录中移出来。

运行之后的结果如下：
```
|-yourmarkdown.md // 只引用了asset/1.png
|-asset
|-asset/1.png
|-unused // 创建一个新文件夹，把yourmarkdown.md中没有用到的图片移动过来
|-unused/2.png
|-unused/3.png
```

## 安装
请全局安装
```
npm i md-img-shaking -g
```

## 使用

请进入到你需要检查的目录下,运行md-img-shaking命令即可：
```
md-img-shaking
```