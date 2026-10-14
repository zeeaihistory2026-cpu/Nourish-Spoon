package com.nourishspoon.app

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.animation.ValueAnimator
import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Path
import android.graphics.PathMeasure
import android.os.Build
import android.provider.Settings
import android.util.AttributeSet
import android.view.View
import android.view.animation.LinearInterpolator
import androidx.core.graphics.PathParser
import org.json.JSONArray

/** Fixed artwork; only the visible length of each gold stroke changes. */
class NourishLogoView @JvmOverloads constructor(
  context: Context, attrs: AttributeSet? = null
) : View(context, attrs) {
  private data class Stroke(val path: Path, val measure: PathMeasure, val width: Float)
  private val strokes: List<Stroke> = context.resources.openRawResource(R.raw.nourish_logo_strokes).use { stream ->
    val records = JSONArray(stream.bufferedReader().readText())
    List(records.length()) { index ->
      val record = records.getJSONObject(index)
      val path = requireNotNull(PathParser.createPathFromPathData(record.getString("d")))
      Stroke(path, PathMeasure(path, false), if (record.getBoolean("tm")) 1.35f else 2.4f)
    }
  }
  private val totalLength = strokes.sumOf { it.measure.length.toDouble() }.toFloat()
  private val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
    color = Color.rgb(201, 168, 76)
    style = Paint.Style.STROKE
    strokeCap = Paint.Cap.ROUND
    strokeJoin = Paint.Join.ROUND
  }
  private val segment = Path()
  private var amount = 0f
  private var animator: ValueAnimator? = null
  private var started = false
  var complete = false
    private set
  var whenFinished: (() -> Unit)? = null

  fun startMotion() {
    if (started) return
    started = true
    val enabled = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      ValueAnimator.areAnimatorsEnabled()
    } else {
      Settings.Global.getFloat(context.contentResolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f) > 0f
    }
    if (!enabled) { finish(); return }
    animator = ValueAnimator.ofFloat(0f, 2000f).apply {
      duration = 2000L
      interpolator = LinearInterpolator()
      addUpdateListener { animation ->
        val elapsed = animation.animatedValue as Float
        amount = ease((elapsed / 1400f).coerceIn(0f, 1f))
        invalidate()
      }
      addListener(object : AnimatorListenerAdapter() {
        override fun onAnimationEnd(animation: Animator) { finish() }
      })
      start()
    }
  }

  private fun ease(progress: Float) = progress * progress * (3f - 2f * progress)
  private fun finish() {
    amount = 1f
    complete = true
    invalidate()
    val callback = whenFinished
    whenFinished = null
    callback?.invoke()
  }

  override fun onDraw(canvas: Canvas) {
    super.onDraw(canvas)
    val save = canvas.save()
    val scale = minOf(width, height) / 224f
    canvas.translate((width - 224f * scale) / 2f, (height - 224f * scale) / 2f)
    canvas.scale(scale, scale)
    var remaining = amount * totalLength
    for (stroke in strokes) {
      paint.strokeWidth = stroke.width
      val length = stroke.measure.length
      if (amount >= 1f || remaining >= length) {
        canvas.drawPath(stroke.path, paint)
      } else if (remaining > 0f) {
        segment.rewind()
        stroke.measure.getSegment(0f, remaining, segment, true)
        canvas.drawPath(segment, paint)
      }
      remaining -= length
    }
    canvas.restoreToCount(save)
  }

  override fun onDetachedFromWindow() {
    whenFinished = null
    animator?.removeAllListeners()
    animator?.cancel()
    animator = null
    super.onDetachedFromWindow()
  }
}
