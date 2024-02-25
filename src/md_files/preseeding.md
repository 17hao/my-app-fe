目标

通过 preseeding 自动化安装 Debian amd64 操作系统。

大致步骤
1. 编写 preseed.cfg 文件
2. 将 preseed.cfg 文件打包到 iso 镜像
3. 制作启动U盘
4. 用 Install 选项（不能选 graphical install）安装

preseed.cfg 文件
---
基于官方提供的[配置文件样板](https://www.debian.org/releases/bookworm/example-preseed.txt)进行修改，可结合带注释的[完整版](http://shiqihao.xyz/preseed-cfg.txt)查看每个配置的含义。

使用 Wi-Fi 的场景下，只能指定要连接的 Wi-Fi，需要手动回车。可参考[源码](https://salsa.debian.org/installer-team/netcfg/-/blob/master/wireless.c)进一步确认。整个安装流程只有这一步需要人工介入。

TODO
1. 装有多块硬盘时怎么配置？
2. boot loader 不会挂载到 `/boot/efi` 目录下，会有问题吗？

```text
# language
d-i debian-installer/locale string en_US
d-i debian-installer/language string en
d-i debian-installer/country string CN
d-i keyboard-configuration/xkb-keymap select us

# networking
d-i netcfg/choose_interface select auto
d-i netcfg/get_hostname string unassigned-hostname
d-i netcfg/get_domain string unassigned-domain
d-i netcfg/hostname string hp-debian
d-i netcfg/wireless_wep string
## 使用有线网无须配置
d-i hw-detect/load_firmware boolean true
d-i netcfg/wireless_show_essids select *your-wifi-name*
d-i netcfg/wireless_essid string *your-wifi-name*
d-i netcfg/wireless_security_type select wpa
d-i netcfg/wireless_wpa string *your-wifi-password*

# mirror
d-i mirror/country string China
d-i mirror/http/hostname string mirrors.tuna.tsinghua.edu.cn
d-i mirror/http/directory string /debian
d-i mirror/http/proxy string

# account
d-i passwd/root-login boolean false
d-i passwd/user-fullname string *your-fullname*
d-i passwd/username string *your-username*
d-i passwd/user-password password *your-password*
d-i passwd/user-password-again password *your-password*

# time
d-i clock-setup/utc boolean true
d-i time/zone string Asia/Shanghai
d-i clock-setup/ntp boolean true

# disk partition
d-i partman-auto/method string regular
d-i partman-auto-lvm/guided_size string max
d-i partman-lvm/device_remove_lvm boolean true
d-i partman-md/device_remove_md boolean true
d-i partman-lvm/confirm boolean true
d-i partman-lvm/confirm_nooverwrite boolean true
d-i partman-auto/choose_recipe select atomic
d-i partman-partitioning/confirm_write_new_label boolean true
d-i partman/choose_partition select finish
d-i partman/confirm boolean true
d-i partman/confirm_nooverwrite boolean true
d-i partman-md/confirm boolean true
d-i partman-partitioning/confirm_write_new_label boolean true
d-i partman/choose_partition select finish
d-i partman/confirm boolean true
d-i partman/confirm_nooverwrite boolean true

# apt
d-i apt-setup/cdrom/set-first boolean false
d-i apt-setup/security_host string mirrors.tuna.tsinghua.edu.cn
## 无桌面环境
tasksel tasksel/first multiselect standard
popularity-contest popularity-contest/participate boolean false

# boot loader
d-i grub-installer/only_debian boolean true
d-i grub-installer/with_other_os boolean true
d-i grub-installer/bootdev  string default

# finish install
d-i finish-install/reboot_in_progress note
d-i debian-installer/exit/poweroff boolean true

# https://unix.stackexchange.com/questions/756108/debian-preseed-installation-is-failing-if-there-a-previous-os-installed
d-i preseed/early_command string umount /media

# 默认使用系统检测到的第一块硬盘
d-i partman/early_command string debconf-set partman-auto/disk "$(list-devices disk | head -n1)"

d-i preseed/late_command string in-target apt autoremove -y vim-common
d-i preseed/late_command string in-target apt install -y vim git curl net-tools psmisc tree
```

重新打包 iso 镜像
---
假设原 iso 镜像下载在`$HOME/Downloads`目录。
```bash
#!/usr/bin/env bash

sudo apt install -y udevil xorriso

iso_image="debian-12.5.0-amd64-netinst.iso"

# extracting the initrd from iso image 
udevil mount $HOME/Downloads/$iso_image
cp -rT /media/$(whoami)/$iso_image $HOME/isofiles

# adding a preseed file to the initrd
chmod +w -R $HOME/isofiles/install.amd/
gunzip isofiles/install.amd/initrd.gz
echo preseed.cfg | cpio -H newc -o -A -F isofiles/install.amd/initrd
gzip isofiles/install.amd/initrd
chmod -w -R isofiles/install.amd/

# regenerating md5sum.txt
cd $HOME/isofiles
chmod +w md5sum.txt
find -follow -type f ! -name md5sum.txt -print0 | xargs -0 md5sum >| md5sum.txt
chmod -w md5sum.txt
cd $HOME

# creating a new bootable iso image
xorriso -as mkisofs -o $iso_image -isohybrid-mbr /usr/lib/ISOLINUX/isohdpfx.bin -c isolinux/boot.cat -b isolinux/isolinux.bin -no-emul-boot -boot-load-size 4 -boot-info-table isofiles

# remove isofiles and unmount the originial iso
chmod +w -R $HOME/isofiles
rm -r $HOME/isofiles
udevil unmount /media/$(whoami)/$iso_image
```

制作启动U盘
---
`lsblk`命令查看U盘设备位置， e.g. /dev/sdc
```bash
sudo cp debian-12.5.0-amd64-netinst.iso /dev/sdX
sync
```

参考资料
---
- https://www.debian.org/releases/stable/amd64/apb.en.html
- https://wiki.debian.org/DebianInstaller/Preseed/EditIso
- https://salsa.debian.org/installer-team/netcfg/-/blob/master/debian/netcfg-common.templates?ref_type=heads
- https://salsa.debian.org/installer-team/netcfg/-/blob/master/wireless.c