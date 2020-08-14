<a name="top"></a>
# A colourful API v1.0.0



 - [Keyword](#Keyword)
   - [Create topic keyword](#Create-topic-keyword)
   - [Get ALL topic keywords](#Get-ALL-topic-keywords)
 - [Topic](#Topic)
   - [Create a topic](#Create-a-topic)
   - [Get ALL topics](#Get-ALL-topics)

___


# <a name='Keyword'></a> Keyword

## <a name='Create-topic-keyword'></a> Create topic keyword
[Back to top](#top)

```
POST /events/topics/keywords
```

### Parameters - `Keyword`

| Name | Type     | Description               |
| ---- | -------- | ------------------------- |
| name | `String` | <p>Topic's name</p>       |
| svg  | `SVG`    | <p>keyword's svg logo</p> |

## <a name='Get-ALL-topic-keywords'></a> Get ALL topic keywords
[Back to top](#top)

```
GET /events/topics/keywords
```

# <a name='Topic'></a> Topic

## <a name='Create-a-topic'></a> Create a topic
[Back to top](#top)

```
POST /events/topics
```

### Parameters - `Topic`

| Name        | Type       | Description                |
| ----------- | ---------- | -------------------------- |
| name        | `String`   | <p>Topic's name</p>        |
| description | `String`   | <p>Topic's description</p> |
| keywords    | `[String]` | <p>keyword ids</p>         |

## <a name='Get-ALL-topics'></a> Get ALL topics
[Back to top](#top)

```
GET /events/topics
```
