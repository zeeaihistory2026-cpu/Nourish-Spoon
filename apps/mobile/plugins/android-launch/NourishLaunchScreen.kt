package com.nourishspoon.app

import android.app.Activity
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.core.content.res.ResourcesCompat

/** Displayed by the activity before React, assets, or JS fonts finish loading. */
object NourishLaunchScreen {
  fun show(activity: Activity) {
    val launch = activity.layoutInflater.inflate(R.layout.nourish_launch_screen, null)
    val display = ResourcesCompat.getFont(activity, R.font.nourish_display_bold)
    val regular = ResourcesCompat.getFont(activity, R.font.nourish_display_regular)
    val body = ResourcesCompat.getFont(activity, R.font.nourish_body_regular)
    launch.findViewById<TextView>(R.id.launch_brand).typeface = display
    launch.findViewById<TextView>(R.id.launch_tagline).typeface = regular
    launch.findViewById<TextView>(R.id.launch_slogan).typeface = regular
    launch.findViewById<TextView>(R.id.launch_products).typeface = body
    launch.findViewById<TextView>(R.id.launch_footer).typeface = regular
    activity.addContentView(launch, ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))
  }

  fun hide(activity: Activity) {
    activity.findViewById<View>(R.id.nourish_launch_overlay)?.let { launch ->
      (launch.parent as? ViewGroup)?.removeView(launch)
    }
  }
}
