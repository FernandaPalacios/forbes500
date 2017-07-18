
# Data Visualization ------------------------------------------------------
library(ggplot2)
# Are there any factors that are clear indicators of ranking? 
# Which factors are better indicators?


# Employees --------------------------------------------------------------
# Few companies have + 50000 employees
ggplot(fortune2015.df, aes(x = num_employees, y = ranking)) + geom_point() + xlim(c(0,50000))
# All over the place!

# Assets ------------------------------------------------------------------
# Few companies have + 50000 employees
ggplot(fortune2015.df, aes(x = assets, y = ranking)) + geom_point() + xlim(c(0,50000))
# All over the place!

# Profit Change -----------------------------------------------------------
# conglomeration near y axis
ggplot(fortune2015.df, aes(x = profitchange, y = ranking)) + geom_point() + xlim(c(-500,500))
# color by positive, negative

# Profits -----------------------------------------------------------------
ggplot(fortune2015.df, aes(x = profits, y = ranking)) + geom_point()  + xlim(c(-10000,40000))
# Lower the ranking, higher the profits

# Revenue Change ----------------------------------------------------------
ggplot(fortune2015.df, aes(x = revchange, y = ranking)) + geom_point() + xlim(c(-50,50))
# All over