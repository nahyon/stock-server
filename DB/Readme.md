# SQL문
1, 2번 : 데이터 삽입 전

3번 : 데이터 삽입 후 진행 (kr_name, kr_desc UPDATE하는 것)


#### table 컬럼 변경한거 다시 작업 필요 ( ** <- 에 적힌 것)


## [daily테이블]
symbol, timestamp, open, high, low, close, volume, change_percent, change_value, marketcap

symbol, date, open, high, low, close, volume, change_percent, change_value, cap
** 컬럼명 변경 timestamp-> date , marketcap -> cap -- 1파일 

## [intraday테이블]
symbol, timestamp, open, high, low, close, volume

symbol, datetime, open, high, low, close, volume
** 컬럼명 변경 timestamp -> datetime --1파일


## [companyinfo 테이블] 
symbol, name, kr_name, description, kr_desc, imgurl
symbol, name_en, name_kr, desc_kr , desc_en , img (TEXT타입), shareout, updatedAt_daily, updatedAt_intraday cap제거 

-- 1 파일
** 컬럼명 변경 (name, kr_name) -> (name_en, name_kr) , (description, kr_desc) -> (desc_kr, desc_en) ,
** 컬럼 추가 img(TEXT) , shareout, updatedAt_daily(DATE), updatedAt_intraday(DATETIME)
** 컬럼 제거 cap 
**name_kr, desc_kr UPDATE -- 2 파일에 SQL문

0406 전달사항
[companyinfo] - shareout추가 필요 , {imgurl -> img} 컬럼명 변경