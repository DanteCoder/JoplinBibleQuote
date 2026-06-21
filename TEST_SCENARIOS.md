# Bible Quote Plugin — Test Scenarios

All citations use **NTV** (Nueva Traducción Viviente) and **RV1960** (Reina-Valera 1960).

---

## 1. Help

```bible
help
```

---

## 2. Index — All Books

```bible
index
```

---

## 3. Index — Specific Book

```bible
index Gen
```

```bible
index Exod
```

---

## 4. Single Verse

```bible
(Génesis 1:1)
```

```bible
(Juan 3:16)
```

---

## 5. Verse Range (Same Chapter)

```bible
(Génesis 1:1-5)
```

```bible
(Salmos 23:1-6)
```

---

## 6. Non-Consecutive Verses

```bible
(Génesis 1:1, 1:3, 1:5)
```

---

## 7. Chapter Range

```bible
(Génesis 1:1-2:3)
```

---

## 8. Entire Chapter

```bible
(Génesis 1)
```

```bible
(Salmos 23)
```

---

## 9. Chapter Range (Entire Chapters)

```bible
(Génesis 1-2)
```

---

## 10. Multi-Book Range

```bible
(Génesis 1:1-Éxodo 1:1)
```

```bible
(Isaías 53:1-55:1)
```

---

## 11. Multiple Separate Citations (Single Version)

```bible
(Génesis 1:1)
(Génesis 1:2-3)
(Éxodo 2:1-3)
```

---

## 12. Single Version

```bible
version "NTV"
(Génesis 1:1)
```

```bible
version "RV1960"
(Juan 3:16)
```

---

## 13. Version + Verse Range

```bible
version "RV1960"
(Génesis 1:1-5)
```

---

## 14. Version + Multiple Citations

```bible
version "NTV"
(Génesis 1:1)
(Éxodo 20:1-17)
(Salmos 23)
```

---

## 15. Multiple Versions (Stacked)

```bible
versions "NTV", "RV1960"
(Génesis 1:1)
```

```bible
versions "NTV", "RV1960"
(Juan 3:16)
```

```bible
versions "NTV", "RV1960"
(Salmos 23:1-6)
```

---

## 16. Multiple Versions + Multiple Citations

```bible
versions "NTV", "RV1960"
(Génesis 1:1)
(Éxodo 20:1-3)
```

---

## 17. Multiple Versions + Chapter Range

```bible
versions "NTV", "RV1960"
(Génesis 1:1-2:3)
```

---

## 18. Multiple Versions + Multi-Book

```bible
versions "NTV", "RV1960"
(Génesis 1:1-Éxodo 1:1)
```

---

## 19. Parallel Mode — Single Verse

```bible
versions "NTV", "RV1960" par
(Génesis 1:1)
```

```bible
versions "NTV", "RV1960" par
(Juan 3:16)
```

---

## 20. Parallel Mode — Verse Range

```bible
versions "NTV", "RV1960" par
(Génesis 1:1-5)
```

```bible
versions "NTV", "RV1960" par
(Salmos 23:1-6)
```

---

## 21. Parallel Mode — Chapter Range

```bible
versions "NTV", "RV1960" par
(Génesis 1:1-2:3)
```

---

## 22. Parallel Mode — Multi-Book Range

```bible
versions "NTV", "RV1960" par
(Génesis 1:1-Éxodo 1:1)
```

---

## 23. Parallel Mode — Multiple Citations

```bible
versions "NTV", "RV1960" par
(Génesis 1:1)
(Éxodo 20:1-3)
```

---

## 24. Parallel Mode — Entire Chapter

```bible
versions "NTV", "RV1960" par
(Salmos 23)
```

---

## 25. Mixed: Version Switch + Parallel

```bible
version "NTV"
(Génesis 1:1)
(Juan 3:16)

versions "NTV", "RV1960" par
(Salmos 23:1-6)
```

---

## 26. Non-Consecutive Verses (Multiple Versions)

```bible
versions "NTV", "RV1960"
(Génesis 1:1, 1:3, 1:5)
```

---

## 27. Non-Consecutive Verses (Parallel)

```bible
versions "NTV", "RV1960" par
(Génesis 1:1, 1:3, 1:5)
```

---

## 28. Complex — Multi-Version + Multi-Book + Chapter Range

```bible
versions "NTV", "RV1960"
(Génesis 1:1-2:3, Éxodo 20:1-17)
```

---

## 29. Complex — Same in Parallel

```bible
versions "NTV", "RV1960" par
(Génesis 1:1-2:3, Éxodo 20:1-17)
```

---

## 30. Error — Invalid Citation

```bible
(InvalidCitation)
```

```bible
(Zacarías 99:1)
```

---

## 31. Error — Invalid Version

```bible
version "KJV"
(Génesis 1:1)
```

---

## 32. Error — Empty Block

```bible
version "NTV"
```

---

## 33. Edge Case — Single Verse with Chapter Header (Multiple Chapters)

```bible
version "NTV"
(Génesis 1:1, 2:1)
```

---

## 34. Edge Case — Single Verse with Book Header (Multiple Books)

```bible
version "NTV"
(Génesis 1:1, Éxodo 1:1)
```

---

## 35. Edge Case — Previous Bug: Empty Citation

This was the exact input that exposed the `start.type` bug:

```bible
version "NTV"
(Génesis 1:11-12, Éxodo 5:1-3)
```

**Expected:** Citation shows `Génesis 1:11-12 Éxodo 5:1-3` (not empty `<b></b>`).

---

## 36. Edge Case — Previously Bug: Single Verse Empty Citation

```bible
version "NTV"
(Génesis 1:11)
```

**Expected:** Citation shows `Génesis 1:11` (not empty `<b></b>`).
