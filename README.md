# TR.KR 백엔드 
협업을 해봅시다


## 초기 설정
일단 git깔려있다는 전제
>git config --global user.name "ryuwldnjs"<br>
>git config --global user.email "ryu_eclipse@naver.com"   //본인 ID, 이메일로 바꿔서 하기

>git clone https://github.com/tr-kr/BE.git <br> //깃헙에서 파일 가져온 후 본인이 만든 js파일(src/app위치에)+테스트용html파일 추가하기
>git init <br>
>git add . <br>
>git commit -m '커밋 메시지'
>git push origin dev // origin설정 안돼 있으면 https://github.com/tr-kr/trkrBE.git

origin 경로 설정
>//현재 "origin" 원격 저장소의 URL 확인 <br>
>git remote -v <br>
>//"origin" 원격 저장소의 URL 변경 <br>
>git remote set-url origin https://github.com/tr-kr/BEBE.git dev

중간에 warning뜨는건 무시해도 됨

## error: failed to push some refs to 'https://github.com/tr-kr/BE.git' <br>
### ->로컬에 dev브랜치가 없어서 에러뜰때
>git branch <br>
>git checkout -b dev <br>
>git add . <br>
>git commit -m '커밋할때 적을 메세지'

### ->local repository에 없는 파일에 remote repository에 존재할때
최신화 관련 이슈
>git pull origin 

이후 다시 push