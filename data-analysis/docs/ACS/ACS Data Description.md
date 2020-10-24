### Data Source
`cd data-analysis/ACS playbook.ipynb`

#### Location/Predicates

**New York City - tract**
```
predicates["get"] = ",".join(get_vars)
predicates["for"] = "tract:*"
predicates["in"] = "state:36;county:081,047,061,005,085"
```

**New York City - County**
```
predicates["get"] = ",".join(get_vars)
predicates["for"] = "county:081,047,061,005,085"
predicates["in"] = "state:36"
```

#### Variables
**dataset = "acs/acs5"**

https://api.census.gov/data/2018/acs/acs5/variables.html

**dataset = "acs/acs5/subject"**

https://api.census.gov/data/2018/acs/acs5/subject/variables.html

*rent/income percentage*
```
S2503_C01_025E - S2503_C01_046E = MONTHLY HOUSING COSTS AS A PERCENTAGE OF HOUSEHOLD INCOME, by income and percentage
```

**dataset = "acs/acs5/profile"**

https://api.census.gov/data/2018/acs/acs5/profile/variables.html

*income*

```
DP03_0051E = total household income and benefits
DP03_0052E - # DP03_0061E = income group by amount
DP03_0062E = median household income
```

*rent*
```
DP04_0126E = Gross Rent
DP04_0127E - DP04_0123E = Rent group by amount
DP04_0134E = Median Rent
DP04_0135E = No rent paid
```