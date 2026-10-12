Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Aqparat7\.gemini\antigravity\brain\5fc40780-0863-46b3-9c6f-6f22d34661f9\.user_uploaded\media_1791827611264_f1f2a400.jpg"
$img = [System.Drawing.Bitmap]::FromFile($srcPath)

Write-Host "Scanning Section 3 (World Regions):"
# The section is titled "3. БАСТЫ ӘЛЕМ КАРТАСЫ — АЙМАҚТАР" around y=235..250.
# The islands are between y=250 and y=480.
# Let's find where the label pills under each island are:
# In each island, there is a blue pill under it, e.g. "Сандар патшалығы (Математика)".
# Let's scan y around 430..470:
for ($y = 430; $y -lt 470; $y += 2) {
    $c = $img.GetPixel(80, $y) # Island 1 center approx
    Write-Host "y=$y : at x=80 color=($($c.R),$($c.G),$($c.B))"
}
$img.Dispose()
