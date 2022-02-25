# 기본 전제
프로젝트가 끝날 때까지 company 500개 변경 없을 것임!!

## insertcompany.js
companyinfo테이블에 insert하는 코드

#### /companystore

이는 맨 처음 한 번 실행 후 프로젝트가 끝날 때까지 변경이 없을 것임!! (company 500개에 더이상 변동이 없기 때문!)
1. 처음에 SQL문으로 companyinfo 테이블 생성 후, 
2. 이 insertcompany.js를 통해 companyinfo테이블에 알파벤티지api를 호출해서 500개를 받아온다.
3. UPDATE문 (우리가 직접 작성한 것)으로 한글 이름, 한글 설명을 테이블에 채워넣는다.
4. (미정..) 나중에 종목 삭제, 삽입하는 경우도 고려해서 그런 경우의 코드도 추가해야할지도.....)

### [companyinfo 테이블] 
symbol, name, kr_name, description, kr_desc, imgurl

(-> 위에도 적어놨듯이 한 번 테이블을 완성하면 플젝끝날때까진 바꾸지 않을 내용들 (아마도..))

*추가 필요 : imgurl (각 종목 당 이미지 필요함!)

*기존의 marketcap은 daily 테이블로 가서 일별로 데이터 들어갈 것임


## insertdata.js:
daily테이블, intraday테이블에 insert하는 코드 (companyinfo테이블이 다 완성되어있어야지 사용가능 - companyinfo테이블에서 종목들을 가져오기 때문)

#### /store/:func (store/daily) (store/intraday5min)

1. 처음에 companyinfo테이블에 쿼리를 날려서 종목들을 가져온다.
2. 종목 각각에 대한 데이터를 daily테이블에 넣는다. / intraday테이블에 넣는다.

### [daily테이블]
symbol, timestamp, open, high, low, close, volume, change_percent, change_value, marketcap

*추가 필요 : marketcap컬럼 

*추가 필요 : change_percent, change_value는 계산해서 넣어주기

*추가 필요 : 테이블에 가장최근에 저장된 날짜를 보고, api를호출하는 당일날 ~ 안가져온(업데이트안된)날짜들까지 다 가져올수있도록 코드짜기
 (ex 3일 전에 호출하고 오늘 호출한다면, 빠져있는 날짜가 2일전 1일전임을 알고 그것까지 가져와야함)

### [intraday테이블]
symbol, timestamp, open, high, low, close, volume



