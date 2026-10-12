Add-Type -AssemblyName System.Drawing

$bmp = [System.Drawing.Bitmap]::FromFile("public\assets\test_qyran_idle.png")
Write-Host "Analyzing test_qyran_idle row brightness at center (x=47):"
for ($y = 0; $y -lt $bmp.Height; $y += 5) {
    $c = $bmp.GetPixel(47, $y)
    $cEdge = $bmp.GetPixel(5, $y)
    Write-Host "y=$y : Center=($($c.R),$($c.G),$($c.B)) Edge=($($cEdge.R),$($cEdge.G),$($cEdge.B))"
}
$bmp.Dispose()
