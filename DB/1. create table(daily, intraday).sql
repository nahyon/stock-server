CREATE TABLE IF NOT EXISTS daily (symbol VARCHAR(50), timestamp DATE NOT NULL, open DECIMAL(10,4) NOT NULL, high DECIMAL(10,4) NOT NULL, low DECIMAL(10,4) NOT NULL, close DECIMAL(10,4) NOT NULL, volume INT NOT NULL, change_percent DECIMAL(10,4), change_value DECIMAL(10,4), cap INT, constraint daily_PK primary key(symbol, timestamp));

CREATE TABLE IF NOT EXISTS intraday (symbol VARCHAR(50), timestamp DATETIME NOT NULL, open DECIMAL(10,4) NOT NULL, high DECIMAL(10,4) NOT NULL, low DECIMAL(10,4) NOT NULL, close DECIMAL(10,4) NOT NULL, volume INT NOT NULL, constraint daily_PK primary key(symbol, timestamp));

CREATE TABLE IF NOT EXISTS company_info(symbol VARCHAR(10), id INT AUTO_INCREMENT, name_en VARCHAR(50), name_kr VARCHAR(50), desc_en TEXT, desc_kr TEXT, img TEXT, shareout INT, updatedAt_daily DATE, updatedAt_intraday DATETIME, constraint company_info_PK primary key(id, symbol));
