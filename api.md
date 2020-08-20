<a name="top"></a>
# A colourful API v1.0.0



 - [Keyword](#Keyword)
   - [Create topic keyword](#Create-topic-keyword)
   - [Delete topic keyword](#Delete-topic-keyword)
   - [Get ALL topic keywords](#Get-ALL-topic-keywords)
   - [Update topic keyword](#Update-topic-keyword)
 - [Topic](#Topic)
   - [Create a topic](#Create-a-topic)
   - [Delete topic](#Delete-topic)
   - [Get ALL topics](#Get-ALL-topics)
   - [Update topic](#Update-topic)

___


# <a name='Keyword'></a> Keyword

## <a name='Create-topic-keyword'></a> Create topic keyword
[Back to top](#top)

```
POST /events/topics/keywords
```

### Parameters - `Keyword`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| name | `String` | <p>Topic's name</p> |
| svg | `SVG` | <p>keyword's svg logo</p> |

## <a name='Delete-topic-keyword'></a> Delete topic keyword
[Back to top](#top)

```
DELETE /events/topics/keywords
```

### Parameters - `Keyword`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| id | `String` | <p>Keyword ID</p> |

## <a name='Get-ALL-topic-keywords'></a> Get ALL topic keywords
[Back to top](#top)

```
GET /events/topics/keywords
```

## <a name='Update-topic-keyword'></a> Update topic keyword
[Back to top](#top)

```
PUT /events/topics/keywords/:id
```

### Parameters - `Keyword`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| id | `String` | <p>Keyword ID</p> |
| name | `String` | <p>Keyword name</p> |
| svg | `SVG` | <p>keyword's svg logo</p> |

# <a name='Topic'></a> Topic

## <a name='Create-a-topic'></a> Create a topic
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

## <a name='Delete-topic'></a> Delete topic
[Back to top](#top)

```
DELETE /events/topics
```

### Parameters - `Topic`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| id | `String` | <p>Topic ID</p> |

## <a name='Get-ALL-topics'></a> Get ALL topics
[Back to top](#top)

```
GET /events/topics
```

## <a name='Update-topic'></a> Update topic
[Back to top](#top)

```
PUT /events/topics/:id
```

### Parameters - `Topic`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| id | `String` | <p>Topic ID</p> |
| name | `String` | <p>Topic name</p> |
| description | `String` | <p>Topic description</p> |
| keywords | `[String]` | <p>Array of Keyword ids</p> |
