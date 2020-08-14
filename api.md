<a name="top"></a>
# A colourful API v0.1.0



 - [Keyword](#Keyword)
   - [Create a new topic keyword](#Create-a-new-topic-keyword)
   - [Get all event topic keywords](#Get-all-event-topic-keywords)
 - [Topic](#Topic)
   - [Create a new topic](#Create-a-new-topic)
   - [Get a new topic](#Get-a-new-topic)

___


# <a name='Keyword'></a> Keyword

## <a name='Create-a-new-topic-keyword'></a> Create a new topic keyword
[Back to top](#top)

```
POST /events/topics/keywords
```

### Parameters - `Keyword`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| name | `String` | <p>Topic's name</p> |
| svg | `SVG` | <p>keyword's svg logo</p> |

## <a name='Get-all-event-topic-keywords'></a> Get all event topic keywords
[Back to top](#top)

```
GET /events/topics/keywords
```

# <a name='Topic'></a> Topic

## <a name='Create-a-new-topic'></a> Create a new topic
[Back to top](#top)

```
POST /events/topics
```

### Parameters - `Topic`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| name | `String` | <p>Topic's name</p> |
| description | `String` | <p>Topic's description</p> |
| keywords | `[String]` | <p>keyword ids</p> |

## <a name='Get-a-new-topic'></a> Get a new topic
[Back to top](#top)

```
GET /events/topics
```
