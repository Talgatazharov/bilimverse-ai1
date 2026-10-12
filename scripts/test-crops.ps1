Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Aqparat7\.gemini\antigravity\brain\5fc40780-0863-46b3-9c6f-6f22d34661f9\.user_uploaded\media_1791827611264_f1f2a400.jpg"
$img = [System.Drawing.Bitmap]::FromFile($srcPath)

# Let's crop sample test images for Qyran states:
# Section 1 is in upper left:
# y range is approx 25 to 195. Labels are at y approx 200..215.
# Let's test x slices:
# Idle: ~10 to 105
# Happy: ~100 to 220
# Thinking: ~220 to 295
# Explaining: ~295 to 395
# Celebrating: ~395 to 495
# Sleeping: ~485 to 595

function Crop-Exact($x, $y, $w, $h, $name) {
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $w, $h)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $bmp.Save("public\assets\test_$name.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Saved test: public\assets\test_$name.png ($w x $h)"
}

if (-not (Test-Path "public\assets")) {
    New-Item -ItemType Directory -Path "public\assets" -Force | Out-Null
}

Crop-Exact 8 30 95 165 "qyran_idle"
Crop-Exact 100 30 115 165 "qyran_happy"
Crop-Exact 220 30 80 165 "qyran_thinking"
Crop-Exact 298 30 100 165 "qyran_explaining"
Crop-Exact 395 30 100 165 "qyran_celebrating"
Crop-Exact 485 50 110 145 "qyran_sleeping"

# Avatars (Section 2)
# Boy: ~620 to 695, y 25 to 210
# Girl: ~695 to 770, y 25 to 210
Crop-Exact 620 25 76 185 "avatar_boy"
Crop-Exact 696 25 76 185 "avatar_girl"

# Regions (Section 3) - 6 floating islands
# y: 250 to 455
# 1. Math: ~10 to 135
# 2. Kazakh: ~140 to 265
# 3. Literature: ~265 to 390
# 4. Science/World: ~390 to 515
# 5. English: ~515 to 640
# 6. Digital: ~640 to 765
Crop-Exact 12 250 126 200 "region_math"
Crop-Exact 142 250 124 200 "region_kazakh"
Crop-Exact 268 250 124 200 "region_literature"
Crop-Exact 394 250 124 200 "region_science"
Crop-Exact 518 250 122 200 "region_english"
Crop-Exact 640 250 124 200 "region_digital"

# Chests (Section 6)
Crop-Exact 726 512 88 126 "chest_closed"
Crop-Exact 818 512 92 126 "chest_opening"
Crop-Exact 912 512 102 126 "chest_open"

$img.Dispose()
