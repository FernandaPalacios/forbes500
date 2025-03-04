library(rvest)
library(dplyr)
library(stringr)
library(ggplot2)


# FACTORS: Rev Change, Profits, Profit Change, Assets, Employees
# extracting each factor from its own site, ranking from employees'site


# Employees & Ranking 2015 --------------------------------------------------------------------

# Companies
employees2015.html= read_html("Data/employees2015.html")
companies2015.span = employees2015 %>% html_nodes("span.company-name")
companies2015 = companies2015.span %>% html_text()

# Employees
employees2015 = employees2015 %>% 
  html_nodes("div.company-list-sort-type-container > div > div") %>%
  html_text()

# Ranking
rankings2015 = employees2015.html %>% 
  html_nodes("span.ranking") %>%
  html_text()%>% 
  as.numeric()

# Clean and convert
employees2015.numeric = str_replace_all(employees2015, "\n", "") %>%
  str_replace_all("\t", "") %>%
  str_replace_all(",", "")  %>% 
  as.numeric()

# Build data frame
emp_ran.df = data.frame(ranking = rankings2015, company = companies2015, num_employees = employees2015.numeric)

# Split num_employees by tens of thousands

# emp_ran.df$group_by_employees = emp_ran.df$num_employees%/%10000


# Profits 2015 ------------------------------------------------------------
# Companies
profits2015 = read_html("Data/profits2015.html")
companies2015profit.span = profits2015 %>% html_nodes("span.company-name")
companies2015profit = companies2015profit.span %>% html_text()


# Profits (Millions)
profits2015.text = profits2015 %>% 
  html_nodes(".sort-value") %>%
  html_text()

# Clean and convert

profits2015.numeric = str_replace_all(profits2015.text, "\n", "") %>%
  str_replace_all("\t", "") %>%
  str_replace_all(",", "")  %>% 
  as.numeric()


# Build data frame
profits.df = data.frame(company = companies2015profit, profits = profits2015.numeric)



# Merge dataframes --------------------------------------------------------
# Missing:  Rev Change,  Profit Change, Assets

# Rev Change 2015  --------------------------------------------------------
# Companies
revchange2015 = read_html("Data/revchange2015.html")
companies2015revchange.span = revchange2015 %>% html_nodes("span.company-name")
companies2015revchange = companies2015revchange.span %>% html_text()


# Rev Change (%)
revchange2015.text = revchange2015 %>% 
  html_nodes("div.company-list-sort-type-container > div > div") %>%
  html_text()


# Clean and convert
revchange2015.numeric = str_replace_all(revchange2015.text, "\n", "") %>%
  str_replace_all("\t", "") %>%
  str_replace_all(",", "")  %>% 
  str_replace_all("%", "")  %>% 
  as.numeric()


# Build data frame
revchange.df = data.frame(company = companies2015revchange, revchange = revchange2015.numeric)


# Profit Change -----------------------------------------------------------
# Companies
profitchange2015 = read_html("Data/profitchange2015.html")
companies2015profitchange.span = profitchange2015 %>% html_nodes("span.company-name")
companies2015profitchange = companies2015profitchange.span %>% html_text()



# Profit Change (%)
profitchange2015.text = profitchange2015 %>% 
  html_nodes(".sort-value") %>%
  html_text()


# Clean and convert
profitchange2015.numeric = str_replace_all(profitchange2015.text, "\n", "") %>%
  str_replace_all("\t", "") %>%
  str_replace_all(",", "")  %>% 
  str_replace_all("%", "")  %>% 
  as.numeric()


# Build data frame
profitchange.df = data.frame(company = companies2015profitchange, profitchange = profitchange2015.numeric)



# Assets ------------------------------------------------------------------
# Companies
assets2015 = read_html("Data/assets2015.html")
companies2015assets.span = assets2015 %>% html_nodes("span.company-name")
companies2015assets = companies2015assets.span %>% html_text()



# Assets
assets2015.text = assets2015 %>% 
  html_nodes("div.company-list-sort-type-container > div > div") %>%
  html_text()

# Clean and convert
assets2015.numeric = str_replace_all(assets2015.text, "\n", "") %>%
  str_replace_all("\t", "") %>%
  str_replace_all(",", "")  %>% 
  as.numeric()


# Build data frame
assets.df = data.frame(company = companies2015revchange, assets = assets2015.numeric)

# Complete data frame ------------------------------------------------------

fortune2015.df = merge(emp_ran.df, assets.df, by = "company") %>% 
  merge(profitchange.df, by = "company") %>%
  merge(profits.df, by = "company") %>% 
  merge(revchange.df, by = "company")