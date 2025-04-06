examples are from:
https://www.i18next.com/overview/getting-started


Accessing keys
resources with 2 keys:

{
    "key": "value of key",
    "look": {
        "deep": "value of look deep"
    }
}

Copy
i18next.t('key');
// -> "value of key"

i18next.t('look.deep');
// -> "value of look deep"