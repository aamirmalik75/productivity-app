<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('goals', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('user_id');
      $table->string('title');
      $table->string('description');
      $table->string('status')->default('Incomplete');
      $table->string('feedback')->default('')->nullable();
      $table->timestamp('deadline')->nullable();
      $table->decimal('progress', 5, 2)->default(0);
      $table->unsignedBigInteger('parent_id')->nullable();

      $table->foreign('parent_id')->references('id')->on('goals')->onDelete('cascade');
      $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('goals');
  }
};
