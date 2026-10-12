Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Aqparat7\.gemini\antigravity\brain\5fc40780-0863-46b3-9c6f-6f22d34661f9\.user_uploaded\media_1791827611264_f1f2a400.jpg"
$img = [System.Drawing.Bitmap]::FromFile($srcPath)

Write-Host "Scanning x at y=140 to find all 6 label pills:"
$inPill = $false
$pillStart = 0
for ($x = 0; $x -lt 610; $x++) {
    $c = $img.GetPixel($x, 140)
    # Blue pill has high blue, low red: B > 60 and R < 40 and G > 40
    $isBlue = ($c.B -gt 60 -and $c.R -lt 40 -and $c.G -gt 40)
    if ($isBlue -and -not $inPill) {
        $inPill = $true
        $pillStart = $x
    } elseif (-not $isBlue -and $inPill) {
        $inPill = $false
        Write-Host "Pill found from x=$pillStart to x=$($x-1) (width=$($x-$pillStart))"
    }
}
$img.Dispose()
