每次重置阿里云的服务器后都要重装、配置一些软件，特别麻烦，决定写成脚本。

```bash
#!/bin/bash

if [ $EUID -ne 0 ]
then
    sudo su root
fi

apt-get update
softwares=(cmake gdb tree git npm openjdk-8-jdk astyle ctags vim-nox ruby-dev)
for i in ${softwares[@]}
do
    apt-get install $i -y
done

git config --global user.email "sqh1107@gmail.com"
git config --global user.name "17hao"

git clone https://github.com/17hao/blog.git $HOME/blog
cd $HOME/blog && npm install && ./bin/start.sh

git clone https://github.com/VundleVim/Vundle.vim.git $HOME/.vim/bundle/Vundle.vim
{
    echo "def Settings(**kwargs):"
    echo "      return {'flags': ['-Wall']}"
} >> $HOME/.ycm_c-c++_conf.py

if [ -e $HOME/.vimrc ]
then
    rm -f $HOME/.vimrc
fi

wget -O $HOME/.vimrc http://shiqihao.xyz/vimrc.txt

vi +PluginInstall +qall

cd $HOME/.vim/bundle/command-t && rake make

```
